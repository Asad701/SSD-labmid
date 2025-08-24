// /app/api/2checkout/ipn/route.js
import DbConnect from "@/lib/db";
import Order from "@/models/order";


export async function POST(req) {
  try {
    await DbConnect();

    // Parse JSON or form-data
    const contentType = req.headers.get("content-type") || "";
    let payload = {};
    if (contentType.includes("application/json")) {
      payload = await req.json();
    } else {
      const formData = await req.formData();
      formData.forEach((value, key) => (payload[key] = value));
    }

    // Log the full payload
    console.log("📥 IPN received:", payload);


    // Build order data
    const orderData = {
      orderid: payload.REFNOEXT || payload.EXTERNAL_CUSTOMER_REFERENCE || (payload.CUSTOMEREMAIL + '_' + payload.IPN_TOTALGENERAL),
      name: ((payload.FIRSTNAME || "") + " " + (payload.LASTNAME || "")).trim(),
      userid: payload.SHOPPER_REFERENCE_NUMBER || ayload.EXTERNAL_CUSTOMER_REFERENCE || "guest",
      email: payload.CUSTOMEREMAIL || "",
      orderprice: Number(payload.IPN_TOTALGENERAL || payload.Total || 0),
      shippingaddress: (
        (payload.ADDRESS1 || "") + ", " + (payload.CITY || "") + ", " + (payload.COUNTRY || "")
      ),
      contactno: payload.PHONE || "",
      zip: payload.ZIPCODE || "",
      country: payload.COUNTRY || "",
      status: payload.ORDERSTATUS || "PENDING",
      shipped: false, 
      dhltracking: "",
    };

    // Save to MongoDB
    const savedOrder = await Order.findOneAndUpdate(
      { orderid: orderData.orderid },
      orderData,
      { upsert: true, new: true }
    );

    console.log(`✅ Order saved: ${savedOrder.orderid}, shipped=${savedOrder.shipped}`);
    return new Response("OK", { status: 200 });
  } catch (err) {
    return new Response("Server error", { status: 500 });
  }
}

// Optional GET for testing
export function GET() {
  return new Response("2Checkout IPN Listener Active", { status: 200 });
}
