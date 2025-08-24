import DbConnect from "@/lib/db";
import Mailer from "@/lib/mailer";
import { verifyToken } from "@/lib/auth";
import User from "@/models/user";
import Cart from "@/models/cart"
import Favourite from "@/models/favourite";
import Order from "@/models/order";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";


export const dynamic = "force-dynamic"; 



//GET

export async function GET(request) {
  await DbConnect();
  const { searchParams } = new URL(request.url);
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (error) {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }

  const getType = searchParams.get("get");

  if (getType === "user") {
    const user = await User.findOne({ userid: decoded.userid }).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });

  } else if (getType === "cart") {
    const cartProducts = await Cart.aggregate([
      { $match: { userid: decoded.userid } },
      {
        $lookup: {
          from: "products",
          localField: "productid",
          foreignField: "productid",
          as: "carts"
        }
      }
    ]);
    return NextResponse.json(cartProducts, { status: 200 });

  } else if (getType === "fav") {
    const favs = await Favourite.aggregate([
      { $match: { userid: decoded.userid } },
      {
        $lookup: {
          from: "products",
          localField: "productid",
          foreignField: "productid",
          as: "favs"
        }
      }
    ]);
    return NextResponse.json(favs, { status: 200 });

  }else{
      return NextResponse.json({ message: "Invalid parameters" }, { status: 400 });
  }    
}

// PATCH user update with image support
export async function PATCH(req) {
  await DbConnect();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return NextResponse.json({ message: "login first" }, { status: 401 });

  try {
    const decoded = verifyToken(token);
    const userid = decoded.userid;

    const formData = await req.formData();

    const fname = formData.get("fname");
    const lname = formData.get("lname");
    const email = formData.get("email");
    const address = formData.get("address");
    const avatar = formData.get("avatar");

    const updateFields = {};
    if (fname) updateFields.fname = fname;
    if (lname) updateFields.lname = lname;
    if (email) updateFields.email = email;
    if (address) updateFields.address = address;

    if (avatar && avatar.name) {
      const bytes = await avatar.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(avatar.name);
      const filename = `avatar-${uuidv4()}${ext}`;
      const filepath = path.join(process.cwd(), "public", filename);

      await fs.writeFile(filepath, buffer);
      updateFields.avatar = `/${filename}`;
    }
    const user = await User.findOne({userid});
    await User.updateOne({ userid }, { $set: updateFields });

    const subject = "Update Profile"
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0d6efd; padding: 16px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">Royal Fold & Forge</h1>
        </div>
        <div style="padding: 20px; color: #333;">
          <p style="font-size: 16px;">Hi <strong>${user.fname}</strong>,</p>
          <p style="font-size: 15px; line-height: 1.6;">
            Your profile has been <strong>successfully updated</strong>.
          </p>
          <p style="font-size: 15px; line-height: 1.6;">
            If you did not make this change, please contact our support team immediately.
          </p>
          <div style="margin-top: 20px; text-align: center;">
            <a href="https://royalfoldforge.com/profile" style="display: inline-block; background-color: #0d6efd; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">
              View Profile
            </a>
          </div>
        </div>
        <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 13px; color: #666;">
          Regards,<br>
          <strong>Royal Fold & Forge Team</strong>
        </div>
      </div>

    `;
    const mess = await Mailer(user.email,subject,message);

    return NextResponse.json({message: `${mess}` },{status:200});
  } catch (error) {
    return NextResponse.json({ message: "Update failed\\"}, { status: 500 });
  }
}


// DELETE cart or favourite based on ?remove=cart or ?remove=fav
export async function DELETE(req) {
  await DbConnect();
  const { searchParams } = new URL(req.url);
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (error) {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }

  const removeType = searchParams.get("remove");

  try {
    const body = await req.json();
    const { productid } = body;

    if (!productid) {
      return NextResponse.json({ message: "Missing productid in request body" }, { status: 400 });
    }

    const userid = decoded.userid;

    if (removeType === "fav") {
      const deleted = await Favourite.findOneAndDelete({ userid, productid });
      if (!deleted) {
        return NextResponse.json({ message: "Favourite item not found" }, { status: 404 });
      }
      return NextResponse.json({ message: "Favourite removed successfully" }, { status: 200 });
    }

    if (removeType === "cart") {
      const deleted = await Cart.findOneAndDelete({ userid, productid });
      if (!deleted) {
        return NextResponse.json({ message: "Cart item not found" }, { status: 404 });
      }
      return NextResponse.json({ message: "Cart item removed successfully" }, { status: 200 });
    }
    if (removeType === "cartitem") {
      const existing = await Cart.findOne({ userid, productid });
      if (existing) {
        const newCount = existing.productcount -1;
        if(newCount===0){
          const deleted = await Cart.findOneAndDelete({ userid, productid });
          return NextResponse.json({ message: "Cart item removed successfully" }, { status: 200 });
        }
        else{
          await Cart.updateOne({ userid, productid }, { $set: { productcount: newCount } });
          return NextResponse.json({ message: `removed from cart`, ok: false }, { status: 200 });
        }
      }  
      return NextResponse.json({ message: `item not found`, ok: false }, { status: 200 });
    }
    return NextResponse.json({ message: "Invalid 'remove' parameter" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: "Server error"}, { status: 500 });
  }
}

// POST
export async function POST(req) {
  await DbConnect();
  const { searchParams } = new URL(req.url);
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Please login first to keep track of your orders" }, { status: 401 });
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (error) {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }

  const addType = searchParams.get("addto");
  try {
    const body = await req.json();
    const { productid } = body;

    if (!productid) {
      return NextResponse.json({ message: "Missing productid in request body" }, { status: 400 });
    }

    const userid = decoded.userid;

    if (addType === "fav") {
      const existingProduct = await Favourite.findOne({ userid, productid });
      if (existingProduct) {
        return NextResponse.json({ message: `${existingProduct.productid} Product already added to favorites` }, { status: 400 });
      }
      const pro = new Favourite({ userid, productid });
      const product = await pro.save();
      if (!product) {
        return NextResponse.json({ message: "Try Again later" }, { status: 404 });
      }
      return NextResponse.json({ message: `${product.productid} added to favourite successfully` }, { status: 200 });
    }

    if (addType === "cart") {
      const existing = await Cart.findOne({ userid, productid });
    if (existing) {
      const newCount = existing.productcount + 1;
      await Cart.updateOne({ userid, productid }, { $set: { productcount: newCount } });
      return NextResponse.json({ message: `${existing.productid} One more added to cart`, ok: false }, { status: 200 });
    }

      const pro = new Cart({ userid, productid });
      const product = await pro.save();
      if (!product) {
        return NextResponse.json({ message: "Try Again later" }, { status: 404 });
      }
      return NextResponse.json({ message: `${product.productid} added to Cart successfully` }, { status: 200 });
    }
  return NextResponse.json({ message: "Invalid Parameters" }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ message: "Server error"}, { status: 500 });
  }
}  