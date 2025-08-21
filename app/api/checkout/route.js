import { NextResponse } from "next/server";

export async function POST(req) {
  // Lazy-load Node.js-only modules inside the handler
  const { default: DbConnect } = await import("@/lib/db");
  const { default: TempOrder } = await import("@/models/temporder");
  const { default: Product } = await import("@/models/product");
  const { verifyToken } = await import("@/lib/auth");
  const { cookies } = await import("next/headers");
  const crypto = await import("crypto");

  await DbConnect();

  const cookieStore = cookies();
  const jwt = cookieStore.get("token")?.value;

  let decode;
  try {
    decode = verifyToken(jwt);
  } catch (err) {
    console.error("JWT verification failed:", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { order, method } = await req.json();

    // Validate order
    if (!Array.isArray(order.products) || order.products.length === 0) {
      return NextResponse.json({ error: "Invalid order" }, { status: 400 });
    }
    if (!["card", "paypal"].includes(method)) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }

    // Calculate total price
    let total = 0;
    for (const item of order.products) {
      const product = await Product.findOne({ productid: item.pid });
      if (!product)
        return NextResponse.json({ error: `Product not found: ${item.pid}` }, { status: 404 });

      const price = product.price - (product.discount || 0);
      total += price * item.count;
    }
    const finalPrice = Math.round(total * 100) / 100;

    // Total items
    const totalItems = order.products.reduce((sum, item) => sum + item.count, 0);

    // Create temp order
    const orderRef = crypto.randomBytes(8).toString("hex");
    const tempOrder = new TempOrder({
      orderid: orderRef,
      name: order.name,
      email: order.email,
      shippingaddress: order.address || order.billingAddress,
      city: order.city,
      country: order.country,
      zip: order.zip,
      userid: decode.userid,
      products: order.products,
      orderprice: finalPrice,
      contactno: order.phone,
    });
    await tempOrder.save();

    // Modern 2Checkout v6 payload
    const payload = {
      currency: "USD",
      country: "US",
      billingDetails: {
        name: order.name,
        email: order.email,
        phone: order.phone,
        address: order.address,
        city: order.city,
        country: order.country,
        postalCode: order.zip,
      },
      items: order.products.map((item) => ({
        name: item.name,
        quantity: item.count,
        price: item.price,
      })),
      metadata: { orderRef, userid: decode.userid },
      redirect: {
        returnUrl: `${process.env.NEXT_PUBLIC_SUCCESS_URL}?orderRef=${orderRef}`,
        cancelUrl: process.env.NEXT_PUBLIC_CANCEL_URL,
      },
      paymentMethod: method === "card" ? "card" : "paypal",
    };

    const baseUrl =
      process.env.TCO_ENV === "live"
        ? "https://api.2checkout.com/rest/6.0/orders/"
        : "https://sandbox.2checkout.com/rest/6.0/orders/";

    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.TCO_API_USER}:${process.env.TCO_API_PASSWORD}`
        ).toString("base64")}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!data || !data.redirectUrl) {
      return NextResponse.json({ error: "Failed to create payment", details: data }, { status: 500 });
    }

    return NextResponse.json({ redirectUrl: data.redirectUrl });
  } catch (err) {
    console.error("2Checkout POST error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
