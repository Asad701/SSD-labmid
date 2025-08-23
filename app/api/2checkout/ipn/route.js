import crypto from "crypto";
import { NextResponse } from "next/server";
import DbConnect from "@/lib/db";
import Order from "@/models/order";

// Load env vars
const SECRET_WORD = process.env.TCO_SECRET_WORD?.trim() || "";
const SELLER_ID   = process.env.TCO_SELLER_ID?.trim() || "";

// ---------- Signature helpers ----------
function buildSortedDataString(payload) {
  return Object.keys(payload)
    .sort()
    .filter((k) => !["HASH", "hash", "signature", "SIGNATURE"].includes(k))
    .map((k) => `${k}=${payload[k]}`)
    .join("");
}

// Legacy MD5: md5(SecretWord + SellerId + REFNO + TOTAL)
function md5Legacy(payload) {
  const ref =
    payload["REFNO"] || payload["REFNOEXT"] || payload["ORDERNO"] || "";
  const total =
    payload["PAYMENTTOTAL"] ||
    payload["TOTAL"] ||
    payload["IPN_TOTALGENERAL"] ||
    payload["ORDER_TOTAL"] ||
    "";
  const raw = `${SECRET_WORD}${SELLER_ID}${ref}${total}`;
  return crypto.createHash("md5").update(raw).digest("hex").toUpperCase(); // ✅ force uppercase
}

function hmac(payload, alg) {
  const data = buildSortedDataString(payload);
  return crypto.createHmac(alg, SECRET_WORD).update(data).digest("hex");
}

function hashNoKey(payload, alg) {
  const data = buildSortedDataString(payload);
  return crypto.createHash(alg).update(data).digest("hex");
}

// Try multiple algorithms to match received signature
function verifySignature(payload) {
  const received =
    (payload.HASH || payload.hash || payload.signature || payload.SIGNATURE || "").toString().trim();

  if (!received) return { ok: false, reason: "Missing signature field" };

  const candidates = [];

  // 1) Legacy MD5 (HASH)
  candidates.push({ alg: "md5-legacy", value: md5Legacy(payload) });

  // 2) HMAC variants
  ["sha256", "sha512"].forEach((alg) => {
    try {
      candidates.push({ alg: `hmac-${alg}`, value: hmac(payload, alg) });
    } catch {}
  });

  // 3) Hash-only fallback
  ["sha256", "sha512", "md5"].forEach((alg) => {
    try {
      candidates.push({ alg, value: hashNoKey(payload, alg) });
    } catch {}
  });

  const recLower = received.toLowerCase();
  const hit = candidates.find((c) => c.value.toLowerCase() === recLower);

  return hit
    ? { ok: true, matched: hit.alg }
    : { ok: false, reason: "No algorithm matched", tried: candidates.map((c) => c.alg) };
}

// ---------- Helpers ----------
function toInt(v, d = 0) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : d;
}
function toFloat(v, d = 0) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : d;
}

function extractProducts(payload) {
  const count = toInt(payload["IPN_TOTALGENERALITEMS"] ?? payload["IPN_TOTALGENERAL"] ?? 0, 0);

  if (count > 0 && payload[`IPN_PID[0]`]) {
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push({
        pid: payload[`IPN_PID[${i}]`] || "",
        name: payload[`IPN_NAME[${i}]`] || "",
        quantity: toInt(payload[`IPN_QTY[${i}]`] || 1, 1),
        price: toFloat(payload[`IPN_PRICE[${i}]`] || 0, 0),
      });
    }
    return items;
  }

  if (payload["PRODUCTID"] || payload["PRODUCTNAME"]) {
    return [
      {
        pid: payload["PRODUCTID"] || payload["PRODUCTCODE"] || "",
        name: payload["PRODUCTNAME"] || "",
        quantity: toInt(payload["QUANTITY"] || 1, 1),
        price: toFloat(payload["PRICE"] || payload["PAYMENTAMOUNT"] || 0, 0),
      },
    ];
  }

  return [];
}

function statusInfo(raw) {
  const s = String(raw || "").toUpperCase();
  if (["COMPLETE", "CONFIRMED"].includes(s)) return { status: s, shipped: true };
  return { status: s || "PENDING", shipped: false };
}

// ---------- Route handlers ----------
export async function POST(req) {
  await DbConnect();

  const ct = req.headers.get("content-type") || "";
  let payload = {};
  if (ct.includes("application/json")) {
    payload = await req.json();
  } else {
    const formData = await req.formData();
    for (const [k, v] of formData.entries()) payload[k] = v;
  }

  const verify = verifySignature(payload);
  if (!verify.ok) {
    console.error("❌ Invalid signature", verify, { received: payload.HASH || payload.signature });
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const orderRef = payload["REFNOEXT"] || payload["REFNO"] || payload["ORDERNO"] || "";
  const { status, shipped } = statusInfo(payload["ORDERSTATUS"]);
  const items = extractProducts(payload);

  const gatewayTotal =
    payload["PAYMENTTOTAL"] ||
    payload["TOTAL"] ||
    payload["ORDER_TOTAL"] ||
    payload["IPN_TOTALGENERAL"] ||
    null;

  const computedTotal = items.reduce(
    (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0),
    0
  );
  const orderprice = toFloat(gatewayTotal ?? computedTotal, 0);

  const addressParts = [
    payload["BILLINGADDRESS"],
    payload["BILLINGADDRESS2"],
    payload["CITY"],
    payload["STATE"],
  ].filter(Boolean);

  const orderDoc = {
    orderid: orderRef,
    name: payload["BILLINGNAME"] || `${payload["FNAME"] || ""} ${payload["LNAME"] || ""}`.trim() || "Unknown",
    userid:
      payload["EXTERNAL_CUSTOMER_REFERENCE"] ||
      payload["CLIENTID"] ||
      payload["CUSTOMERID"] ||
      "guest",
    products: items,
    email: payload["EMAIL"] || payload["BILLINGEMAIL"] || "",
    shipped,
    dhltracking: "",
    orderprice,
    shippingaddress: addressParts.join(", ") || "",
    contactno: payload["PHONE"] || payload["PHONENUMBER"] || "",
    zip: payload["ZIPCODE"] || payload["ZIP"] || "",
    country: payload["COUNTRY"] || payload["BILLINGCOUNTRY"] || "",
    status,
  };

  try {
    await Order.findOneAndUpdate(
      { orderid: orderRef },
      orderDoc,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✅ IPN saved: ${orderRef} (matched=${verify.matched}) items=${items.length} status=${status}`);
    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("❌ DB error saving order", err);
    return NextResponse.json({ error: "DB save failed" }, { status: 500 });
  }
}

export function GET() {
  return new Response("2Checkout IPN Listener Active", { status: 200 });
}
