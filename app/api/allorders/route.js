import DbConnect from "@/lib/db";
import Mailer from "@/lib/mailer";
import { verifyToken } from "@/lib/auth";
import Order from "@/models/order";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// GET: Fetch all orders
export async function GET() {
  await DbConnect();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const decode = verifyToken(token);
  if (!decode || decode.apikey !== process.env.API_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });

    return NextResponse.json(orders, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH: Mark order as shipped
export async function PATCH(request) {
  await DbConnect();
  const { orderid, dhltracking } = await request.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const decode = verifyToken(token);
  if (!decode || decode.apikey !== process.env.API_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const order = await Order.findOneAndUpdate(
      { orderid },
      {
        $set: {
          shipped: true,
          dhltracking,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const subject = "Your Order Has Been Shipped";
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <!-- Header -->
        <div style="background-color: #0d6efd; padding: 16px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">Royal Fold & Forge</h1>
        </div>

        <!-- Body -->
        <div style="padding: 20px; color: #333;">
          <p style="font-size: 16px;">Hi <strong>${order.name}</strong>,</p>
          <p style="font-size: 15px; line-height: 1.6;">
            Great news! Your order has been <strong>shipped</strong>.
          </p>
          <p style="font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
            <strong>Order ID:</strong> ${orderid} <br>
            <strong>DHL Tracking Number:</strong> ${dhltracking}
          </p>
          <div style="margin-top: 20px; text-align: center;">
            <a href="https://www.dhl.com/global-en/home/tracking.html?tracking-id=${dhltracking}" 
              style="display: inline-block; background-color: #0d6efd; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">
              Track Your Order
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 13px; color: #666;">
          Regards,<br>
          <strong>Royal Fold & Forge Team</strong>
        </div>
      </div>

    `;


    await Mailer(order.email, subject, message);

    return NextResponse.json({ message: "Order successfully marked as shipped." }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

  