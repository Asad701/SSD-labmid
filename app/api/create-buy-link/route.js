import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers'
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const userid = verifyToken(token);
    const { items } = await req.json();


    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    const merchant = process.env.TWOCHECKOUT_SELLER_ID;
    const secretWord = process.env.TWOCHECKOUT_SECRET;
    const returnUrl = process.env.TWOCHECKOUT_RETURN_URL;

    // Build prod and qty strings
    const prodList = items.map(item => item.id).join(';');
    const qtyList = items.map(item => item.qty).join(';');

    // Create signature string as per 2Checkout direct link format
    const signatureString = merchant + prodList + qtyList + secretWord;

    const signature = crypto.createHash('sha256').update(signatureString).digest('hex');

    const buyUrl = `https://secure.2checkout.com/checkout/buy?merchant=${merchant}&tpl=default&return-type=redirect&return-url=${encodeURIComponent(returnUrl)}&prod=${encodeURIComponent(prodList)}&qty=${encodeURIComponent(qtyList)}&ustomer_external_id=${encodeURIComponent(userid)}&signature=${signature}`;

    return NextResponse.json({ url: buyUrl });
  } catch (err) {
    console.error('Buy link error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
