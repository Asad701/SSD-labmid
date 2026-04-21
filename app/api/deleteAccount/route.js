import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import DbConnect from "@/lib/db";
import User from "@/models/user";
import Cart from "@/models/cart";
import Favourite from "@/models/favourite";
import Order from "@/models/order";
import OrderProduct from "@/models/orderproduct";
import Comment from "@/models/comment";
import TempUser from "@/models/tu";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userid) {
      return NextResponse.json({ error: "Invalid or expired session token" }, { status: 401 });
    }

    // ==========================================
    // CSRF PROTECTION (TOGGLE VERSIONS)
    // ==========================================

    // --- VERSION 1: PREVENT ATTACK (Secure) ---
    /*
    const origin = req.headers.get("origin");
    const referer = req.headers.get("referer");
    const requestedWith = req.headers.get("X-Requested-With");
    const isSameOrigin = origin === "http://localhost:3000" || (referer && referer.startsWith("http://localhost:3000"));

    if (!requestedWith && !isSameOrigin) {
      console.warn(`[SECURITY] Blocked a potential Cross-Site Request (CSRF) from: ${origin || referer}`);
      return NextResponse.json({
        error: "CSRF check failed. Request originated from a forbidden cross-site domain."
      }, { status: 403 });
    }
    */

    // --- VERSION 2: DO ATTACK (Vulnerable) ---
    // (Active: No origin or header check)


    // ==========================================
    // IDOR PROTECTION (TOGGLE VERSIONS)
    // ==========================================

    // Support both JSON and Form Data for CSRF/IDOR demonstration
    let targetUserid;
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json().catch(() => ({}));
      targetUserid = body.userid;
    } else {
      const formData = await req.formData().catch(() => new Map());
      targetUserid = formData.get("userid");
    }

    // Default to the authenticated user's ID if none specified (standard CSRF)
    // but allow IDOR if the check below is disabled.
    if (!targetUserid) {
      targetUserid = decoded.userid;
    }

    // --- VERSION 1: PREVENT ATTACK (Secure) ---
    /* 
    if (targetUserid !== decoded.userid) {
      console.error(`[IDOR] User ${decoded.userid} attempted to delete User ${targetUserid}`);
      return NextResponse.json({
        error: "Forbidden: You are not authorized to delete this account."
      }, { status: 403 });
    }
    */


    // --- VERSION 2: DO ATTACK (Vulnerable) ---
    // (Active: No if-check. The targetUserid from the body is used directly.)


    await DbConnect();

    // 1. Find the target user to verify existence and get details for the response
    const user = await User.findOne({ userid: targetUserid });
    if (!user) {
      return NextResponse.json({ error: `User ${targetUserid} not found.` }, { status: 404 });
    }

    const userEmail = user.email;
    const userName = user.name || "User";

    // 2. Identify all orders to delete associated products
    const userOrders = await Order.find({ userid: targetUserid }).select("orderid");
    const orderIds = userOrders.map(o => o.orderid);

    // 3. Perform deletions across all collections
    await Promise.all([
      User.deleteOne({ userid: targetUserid }),
      Cart.deleteMany({ userid: targetUserid }),
      Favourite.deleteMany({ userid: targetUserid }),
      Order.deleteMany({ userid: targetUserid }),
      OrderProduct.deleteMany({ orderid: { $in: orderIds } }),
      Comment.deleteMany({ userEmail: userEmail }),
      TempUser.deleteMany({ userid: targetUserid })
    ]);

    console.log(`[API] Successfully deleted records for ID: ${targetUserid} (${userEmail})`);

    // 4. Create response showing WHICH user was deleted
    const response = NextResponse.json({
      success: true,
      deleted_user: {
        id: targetUserid,
        email: userEmail,
        name: userName
      },
      message: `Account for ${userName} (${targetUserid}) has been permanently deleted.`
    }, { status: 200 });

    // Only clear cookies if the user deleted THEIR OWN account
    if (targetUserid === decoded.userid) {
      response.cookies.delete("token");
      response.cookies.delete("logged_in");
    }

    return response;

  } catch (err) {
    console.error("DeleteAccount Error:", err);
    return NextResponse.json({ error: `Server error during deletion: ${err.message}` }, { status: 500 });
  }
}