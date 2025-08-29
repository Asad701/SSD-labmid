import DbConnect from "@/lib/db";
import Product from '@/models/product';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await DbConnect();

  try {
    const products = await Product.find({sellingcount:{$gt:0}})
    .sort({sellingcount:-1})
    .limit(10);
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'internal servere error' }, { status: 500 });
  }
}
