import DbConnect from "@/lib/db";
import Order from "@/models/order";

// Normalize products for single or multiple items
function normalizeProducts(payload) {
  // Multiple products (arrays)
  if (Array.isArray(payload["IPN_PID[]"])) {
    return payload["IPN_PID[]"].map((pid, i) => ({
      pid,
      code: payload["IPN_PCODE[]"]?.[i] || pid,
      name: payload["IPN_PNAME[]"]?.[i] || "",
      qty: Number(payload["IPN_QTY[]"]?.[i] || 1),
      price: Number(payload["IPN_PRICE[]"]?.[i] || 0),
    }));
  }

  // Single product fallback
  if (payload["IPN_PID"] || payload["PRODUCTID"] || payload["PRODUCTNAME"]) {
    return [{
      pid: payload["IPN_PID"] || payload["PRODUCTID"] || "",
      code: payload["IPN_PCODE"] || payload["PRODUCTID"] || "",
      name: payload["IPN_PNAME"] || payload["PRODUCTNAME"] || "",
      qty: Number(payload["IPN_QTY"] || payload["QUANTITY"] || 1),
      price: Number(payload["IPN_PRICE"] || payload["PRICE"] || 0),
    }];
  }

  return [];
}

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

    // Log full payload
    console.log("📥 IPN received:", payload);

    // Build order data
    const orderData = {
      orderid: payload.REFNO || payload.ReferenceNo || "unknown",
      name: ((payload.FIRSTNAME || "") + " " + (payload.LASTNAME || "")).trim(),
      userid: payload.SHOPPER_REFERENCE_NUMBER || payload.CustomerReference || "guest",
      products: normalizeProducts(payload),
      email: payload.CUSTOMEREMAIL || "",
      orderprice: Number(payload.IPN_TOTALGENERAL || payload.Total || 0),
      shippingaddress: (
        (payload.ADDRESS1 || "") + ", " + (payload.CITY || "") + ", " + (payload.COUNTRY || "")
      ),
      contactno: payload.PHONE || "",
      zip: payload.ZIPCODE || "",
      country: payload.COUNTRY || "",
      status: payload.ORDERSTATUS || "PENDING",
      shipped: false, // default false
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
    console.error("❌ IPN error", err);
    return new Response("Server error", { status: 500 });
  }
}

// Optional GET for testing
export function GET() {
  return new Response("2Checkout IPN Listener Active", { status: 200 });
}
