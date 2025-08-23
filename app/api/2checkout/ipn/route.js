import crypto from "crypto";
import { NextResponse } from "next/server";
import DbConnect from "@/lib/db"; // adjust path
import Order from "@/models/order";

const SECRET_WORD = process.env.TWOCHECKOUT_SECRET_WORD || "your_secret_word";

// 🔐 HMAC Signature Helper
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

  console.log("✅ Valid IPN received:", payload);

  try {
    const orderId = payload["REFNO"];            // 2Checkout order reference
    const status = payload["ORDERSTATUS"];       // PENDING / COMPLETE etc.
    const totalProducts = parseInt(payload["IPN_TOTALGENERALITEMS"] || "1");

    // 🔄 Extract products array
    const products = [];
    for (let i = 0; i < totalProducts; i++) {
      products.push({
        pid: payload[`IPN_PID[${i}]`],            // product code
        name: payload[`IPN_NAME[${i}]`] || "",
        quantity: parseInt(payload[`IPN_QTY[${i}]`] || "1"),
        price: parseFloat(payload[`IPN_PRICE[${i}]`] || "0"),
      });
    }

    // Save order
    const orderData = {
      orderid: orderId,
      name: payload["BILLINGNAME"] || "Unknown",
      userid: payload["MERCHANTID"] || "guest",
      products,
      email: payload["EMAIL"] || "",
      shipped: status === "COMPLETE" ? true : false,
      dhltracking: "",
      orderprice: parseFloat(payload["PAYMENTTOTAL"] || "0"),
      shippingaddress: payload["BILLINGADDRESS"] || "",
      contactno: payload["PHONE"] || "",
      zip: payload["ZIPCODE"] || "",
      country: payload["COUNTRY"] || "",
    };

    await Order.findOneAndUpdate({ orderid: orderId }, orderData, {
      upsert: true,
      new: true,
    });

    console.log(`✅ Order ${orderId} saved/updated with ${products.length} items.`);
  } catch (error) {
    console.error("❌ Error saving order:", error);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }

  return new Response("OK", { status: 200 });
}

export function GET() {
  return new Response("2Checkout IPN Listener Active", { status: 200 });
}
