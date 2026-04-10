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

    // Decode token to securely get userid (mitigates IDOR payload spoofing)
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userid) {
      return NextResponse.json({ error: "Invalid or expired session token" }, { status: 401 });
    }

    const userid = decoded.userid;

    await DbConnect();
    
    // 1. Find the target user to get their email and verify existence
    const user = await User.findOne({ userid });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userEmail = user.email;
    console.log(`[API] Starting full data deletion for user: ${userid} (${userEmail})`);

    // 2. Identify all orders to delete associated products
    const userOrders = await Order.find({ userid }).select("orderid");
    const orderIds = userOrders.map(o => o.orderid);

    // 3. Perform deletions across all collections
    await Promise.all([
      User.deleteOne({ userid }),
      Cart.deleteMany({ userid }),
      Favourite.deleteMany({ userid }),
      Order.deleteMany({ userid }),
      OrderProduct.deleteMany({ orderid: { $in: orderIds } }),
      Comment.deleteMany({ userEmail: userEmail }),
      TempUser.deleteMany({ userid })
    ]);

    console.log(`[API] Successfully deleted records for ${userid}. Clearing cookies...`);

    // 4. Create response and clear session cookies
    const response = NextResponse.json({ 
      success: true, 
      message: "Account and all associated data permanently deleted from database." 
    }, { status: 200 });

    response.cookies.delete("token");
    response.cookies.delete("logged_in");

    return response;

  } catch (err) {
    console.error("DeleteAccount Error:", err);
    return NextResponse.json({ error: `Server error during deletion: ${err.message}` }, { status: 500 });
  }
}
