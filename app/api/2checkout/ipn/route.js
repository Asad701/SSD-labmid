import crypto from "crypto";
import { NextResponse } from "next/server";
import DbConnect from "@/lib/db";
import Order from "@/models/order";

const SECRET_WORD = process.env.TWOCHECKOUT_SECRET_WORD;

// 🔐 Helper: calculate HMAC_SHA512 signature
function calculateHmacSignature(payload, secret) {
  const sortedKeys = Object.keys(payload).sort();
  const dataString = sortedKeys
    .filter((key) => key !== "HASH" && key !== "signature")
    .map((key) => `${key}=${payload[key]}`)
    .join("");

  return crypto
    .createHmac("sha512", secret)
    .update(dataString)
    .digest("hex")
    .toUpperCase();
}

// 📌 Webhook POST handler
export async function POST(req) {
  await DbConnect();

  const formData = await req.formData();
  const payload = {};

  for (let [key, value] of formData.entries()) {
    payload[key] = value;
  }

  // ✅ Validate signature
  const receivedSignature = payload["HASH"] || payload["signature"];
  if (!receivedSignature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const expectedSignature = calculateHmacSignature(payload, SECRET_WORD);

  if (receivedSignature !== expectedSignature) {
    console.error("❌ Invalid signature:", { expectedSignature, receivedSignature });
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  // ✅ Valid IPN received
  console.log("✅ Valid IPN received:", payload);

  try {
    // Extract order info from 2Checkout payload
    const orderId = payload["REFNO"]; // 2Checkout order reference number
    const status = payload["ORDERSTATUS"]; // e.g., "PENDING", "COMPLETE", "DECLINED"

    // Save or update order
    const orderData = {
      orderid: orderId,
      name: payload["BILLINGNAME"] || "Unknown",
      userid: payload["MERCHANTID"] || "guest",
      products: [{ name: payload["PRODUCTNAME"], price: payload["PAYMENTAMOUNT"] }],
      email: payload["EMAIL"] || "",
      shipped: status === "COMPLETE" ? true : false,
      dhltracking: "",
      orderprice: parseFloat(payload["PAYMENTAMOUNT"] || 0),
      shippingaddress: payload["BILLINGADDRESS"] || "",
      contactno: payload["PHONE"] || "",
      zip: payload["ZIPCODE"] || "",
      country: payload["COUNTRY"] || "",
    };

    // Upsert (create if not exists, update if exists)
    await Order.findOneAndUpdate(
      { orderid: orderId },
      orderData,
      { upsert: true, new: true }
    );

    console.log(`✅ Order ${orderId} saved/updated (status: ${status})`);
  } catch (error) {
    console.error("❌ Error saving order:", error);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }

  return new Response("OK", { status: 200 });
}

// 🧪 Test GET endpoint
export function GET() {
  return new Response("2Checkout IPN Listener Active", { status: 200 });
}
