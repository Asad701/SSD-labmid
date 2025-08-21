import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.formData();

  const receivedParams = {};
  for (const [key, value] of body.entries()) {
    receivedParams[key] = value;
  }

  console.log('📦 Webhook Received:', receivedParams);

  // TODO: Verify HMAC signature from 2Checkout (depends on INS/IPN type)

  return NextResponse.json({ success: true });
}
