// app/api/orders/verify/route.js
import { NextResponse } from "next/server";

export async function GET(req) {
  // Lazy-load Node/DB modules
  const { default: DbConnect } = await import("@/lib/db");
  const { default: TempOrder } = await import("@/models/temporder");
  const { default: Order } = await import("@/models/order");

  await DbConnect();

  const { searchParams } = new URL(req.url);
  const orderRef = searchParams.get("orderRef");

  if (!orderRef) {
    return NextResponse.json({ success: false, error: "Missing orderRef" }, { status: 400 });
  }

  try {
    const tempOrder = await TempOrder.findOne({ orderid: orderRef });
    if (!tempOrder) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    if (!tempOrder.twocheckoutOrderNumber) {
      return NextResponse.json({
        success: false,
        error: "Missing 2Checkout order number for verification",
      }, { status: 400 });
    }

    const baseUrl =
      process.env.TCO_ENV === "live"
        ? "https://api.2checkout.com/rest/6.0"
        : "https://sandbox.2checkout.com/rest/6.0";

    // Fetch order details from 2Checkout v6
    const verifyRes = await fetch(
      `${baseUrl}/orders/${tempOrder.twocheckoutOrderNumber}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Basic ${Buffer.from(
            `${process.env.TCO_API_USER}:${process.env.TCO_API_PASSWORD}`
          ).toString("base64")}`,
        },
      }
    );

    const verifyData = await verifyRes.json();

    if (!verifyRes.ok) {
      return NextResponse.json({
        success: false,
        error: "Failed to verify with 2Checkout",
        details: verifyData,
      });
    }

    // Check payment status in v6 response
    const payments = verifyData.payments || [];
    const paymentVerified = payments.some(
      (p) => ["approved", "complete", "paid"].includes(p.status?.toLowerCase())
    );

    if (!paymentVerified) {
      return NextResponse.json({
        success: false,
        paymentVerified: false,
        error: "Payment not approved",
        payments,
      });
    }

    // Avoid duplicate saves
    const existingOrder = await Order.findOne({ orderid: orderRef });
    if (!existingOrder) {
      const savedOrder = new Order(tempOrder.toObject());
      await savedOrder.save();
    }

    return NextResponse.json({
      success: true,
      paymentVerified: true,
      order: {
        customerName: tempOrder.name,
        total: tempOrder.orderprice,
        currency: "USD",
        items: tempOrder.products.map((p) => ({
          name: p.name || "Product",
          quantity: p.count,
          price: p.price || "N/A",
        })),
      },
    });
  } catch (err) {

    return NextResponse.json({ success: false, error: "internal server error" }, { status: 500 });
  }
}
