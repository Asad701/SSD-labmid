import crypto from 'crypto'
import { NextResponse } from 'next/server'

const SECRET_WORD = process.env.TWOCHECKOUT_SECRET_WORD || 'your_secret_word'

// Helper: calculate HMAC_SHA512 signature
function calculateHmacSignature(payload, secret) {
  const sortedKeys = Object.keys(payload).sort()
  const dataString = sortedKeys
    .filter((key) => key !== 'HASH' && key !== 'signature')
    .map((key) => `${key}=${payload[key]}`)
    .join('')

  return crypto
    .createHmac('sha512', secret)
    .update(dataString)
    .digest('hex')
    .toUpperCase()
}

// POST: receives IPN notification
export async function POST(req) {
  const formData = await req.formData()
  const payload = {}

  for (let [key, value] of formData.entries()) {
    payload[key] = value
  }

  const receivedSignature = payload['HASH'] || payload['signature']
  if (!receivedSignature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const expectedSignature = calculateHmacSignature(payload, SECRET_WORD)

  if (receivedSignature !== expectedSignature) {
    console.error('Invalid signature:', { expectedSignature, receivedSignature })
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
  }

  // ✅ Valid request from 2Checkout
  console.log('✅ Valid IPN received:', payload)

  // Example: you might fulfill order, create user, etc.

  return new Response('OK', { status: 200 })
}

// Optional GET endpoint to test the listener is active
export function GET() {
  return new Response('2Checkout IPN Listener Active', { status: 200 })
}
