import DbConnect from "@/lib/db";
import Product from '@/models/product';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await DbConnect();

  try {
    const products = await Product.find({category:'Premium Knives'})
    .sort({ createdAt: -1 })
    .limit(10);
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch luxury products.' }, { status: 500 });
  }
}
