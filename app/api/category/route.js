
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import DbConnect from '@/lib/db';
import Category from '@/models/category';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuid } from 'uuid';


export async function GET(request){
    await DbConnect();
    try{
        const categories = await Category.find({},{_id:0}).sort({createdAt:-1});
        return NextResponse.json(categories,{status:200});
    }
    catch(error){
        return NextResponse.json({message:"somting wrong while fetching categories"},{ status: 401 });
    }
}



export async function POST(request) {
  await DbConnect();
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const decode = verifyToken(token);
  if (decode.apikey !== process.env.API_KEY) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const cat = formData.get('categorytitle');
    const img = formData.get('image');
    const data = {};

    if (img && typeof img === 'object' && 'arrayBuffer' in img) {
      const buffer = Buffer.from(await img.arrayBuffer());
      const ext = path.extname(img.name || '.png');
      const filename = `img-${uuid().split('-')[0]}${ext}`;
      await fs.writeFile(path.join(process.cwd(), 'public', filename), buffer);
      data.image = filename;
    }

    if (cat) {
      data.title = cat;
    }

    data.categoryid = `cat-${uuid().split('-')[0]}`;

    const newCategory = new Category(data);
    const saved = await newCategory.save();

    if (!saved) {
      return NextResponse.json({ message: 'Failed to save' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Category added successfully' }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}


// DELETE
export async function DELETE(request) {
  await DbConnect();
  const cookieStore =await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const decode = verifyToken(token);
  if (decode.apikey !== process.env.API_KEY) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const categoryid = searchParams.get('categoryid');

  if (!categoryid) {
    return NextResponse.json({ message: 'Category ID required' }, { status: 400 });
  }

  try {
    const category = await Category.findOneAndDelete({ categoryid });

    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    if (category.image) {
      const imagePath = path.join(process.cwd(), 'public', category.image);
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        console.warn('Image delete failed:', err.message);
      }
    }

    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}