import crypto from "crypto";
import DbConnect from "@/lib/db";
import Order from "@/models/order";

const IPN_SECRET = process.env.TWOCHECKOUT_IPN_SECRET; // HMAC key
const SECRET_WORD = process.env.TWOCHECKOUT_SECRET_WORD; // legacy MD5 key

// ----- Helpers ----- //
function byteLength(str) {
  let s = str.length;
  for (let i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xdc00 && code <= 0xdfff) i--;
  }
  return s;
}

function buildHashString(payload) {
  let hashString = "";
  Object.keys(payload).forEach((key) => {
    if (key === "HASH") return;
    const val = payload[key].toString();
    const len = byteLength(val);
    if (len > 0) hashString += len + val;
  });
  hashString += SECRET_WORD;
  return hashString;
}

function verifyMd5(payload) {
  if (!payload.HASH) return false;
  const hashString = buildHashString(payload);
  const calculated = crypto.createHash("md5").update(hashString).digest("hex").toUpperCase();
  return calculated === payload.HASH.toUpperCase();
}

function verifyHmac(payload, receivedSignature) {
  if (!receivedSignature) return false;
  const jsonData = JSON.stringify(payload);
  const computed = crypto.createHmac("sha256", IPN_SECRET).update(jsonData).digest("hex");
  return computed.toLowerCase() === receivedSignature.toLowerCase();
}

// Normalize products for schema
function normalizeProducts(payload) {
  if (payload.Items && Array.isArray(payload.Items)) {
    return payload.Items.map((item) => ({
      pid: item.ProductId || item.Code,
      code: item.Code || item.ProductId,
      name: item.Name,
      qty: Number(item.Quantity || 1),
      price: Number(item.Price || 0),
    }));
  } else if (Array.isArray(payload["IPN_PID[]"])) {
    return payload["IPN_PID[]"].map((pid, i) => ({
      pid,
      code: payload["IPN_PCODE[]"]?.[i] || pid,
      name: payload["IPN_PNAME[]"]?.[i] || "",
      qty: Number(payload["IPN_QTY[]"]?.[i] || 1),
      price: Number(payload["IPN_PRICE[]"]?.[i] || 0),
    }));
  }
  return [];
}

// ----- API POST handler ----- //
export async function POST(req) {
  try {
    await DbConnect ();
    let payload = {};
    let isLegacy = false;

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      payload = await req.json();
    } else {
      const formData = await req.formData();
      formData.forEach((value, key) => (payload[key] = value));
      isLegacy = true;
    }

    // Verify signature
    let valid = false;
    if (isLegacy) valid = verifyMd5(payload);
    else valid = verifyHmac(payload, req.headers.get("signature"));

    if (!valid) {
      console.error("❌ Invalid signature", payload.HASH || req.headers.get("signature"));
      return new Response("Invalid signature", { status: 400 });
    }

    // Build order data
    const orderData = {
      orderid: payload.REFNO || payload.ReferenceNo,
      name: (
        (payload.FIRSTNAME || payload.BillingDetails?.FirstName || "") +
        " " +
        (payload.LASTNAME || payload.BillingDetails?.LastName || "")
      ).trim(),
      userid: payload.SHOPPER_REFERENCE_NUMBER || payload.CustomerReference || "guest",
      products: normalizeProducts(payload),
      email: payload.CUSTOMEREMAIL || payload.BillingDetails?.Email || "",
      orderprice: Number(payload.IPN_TOTALGENERAL || payload.Total || 0),
      shippingaddress: (
        (payload.ADDRESS1 || payload.BillingDetails?.Address1 || "") +
        ", " +
        (payload.CITY || payload.BillingDetails?.City || "") +
        ", " +
        (payload.COUNTRY || payload.BillingDetails?.Country || "")
      ),
      contactno: payload.PHONE || payload.BillingDetails?.Phone || "",
      zip: payload.ZIPCODE || payload.BillingDetails?.Zip || "",
      country: payload.COUNTRY || payload.BillingDetails?.Country || "",
      status: payload.ORDERSTATUS || payload.Status || "PENDING",
      shipped: false, // default to false for all new orders
      dhltracking: "",
    };

    await Order.findOneAndUpdate({ orderid: orderData.orderid }, orderData, {
      upsert: true,
      new: true,
    });

    console.log(`✅ Order saved: ${orderData.orderid}, shipped=${orderData.shipped}`);
    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("❌ IPN error", err);
    return new Response("Server error", { status: 500 });
  }
}

// Optional GET test
export function GET() {
  return new Response("2Checkout/Verifone IPN Listener Active", { status: 200 });
}
