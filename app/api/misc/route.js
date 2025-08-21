import DbConnect from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import Misc from "@/models/misc";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from 'uuid';


// GET
export async function GET() {
  try {
    await DbConnect();
    const misc = await Misc.find({ miscid: "dummy001" });

    if (!misc || misc.length === 0) {
      return NextResponse.json({ message: "not found" }, { status: 404 });
    }

    return NextResponse.json(misc, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "internal server error" }, { status: 500 });
  }
}

// POST
export async function POST(request){
   await DbConnect();
   try{
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value; 
        const {videos , comments , images , promo }  = await body.json();
        const miscid = uuid().split('-')[0];
        if(!token){
            return NextResponse.json({message:"unauthorized"},{status:401});
        }
        const decode = verifyToken(token);
        if(decode.apikey !== process.env.API_KEY){
            return NextResponse.json({message:"unauthorized"},{status:401});
        }
        const save = new Misc({
            miscid:miscid,
            videos:videos,
            comments:comments,
            images:images,
            promo:promo,
        });
        const saved = await save();
        if(saved){
            return NextResponse.json({message:"sucessfull"},{status:200});
        }
        return NextResponse.json({message:"error"},{status:500});
   }catch(err){
        return NextResponse.json({message:"error"},{status:500});
   }    
}


//PATCH
export async function PATCH(request) {
  await DbConnect();

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
    }

    const decode = verifyToken(token);
    if (decode.apikey !== process.env.API_KEY) {
      return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const miscid = formData.get('miscid');
    const newVideos = formData.getAll('videos');
    const newImages = formData.getAll('images');
    const promoPercentage = formData.get('promoPercentage');
    const promoImage = formData.get('promoImage');
    const comments = formData.get('comments');

    const updateFields = {};
    const Vid = [];
    const Img = [];
    const promo = {};

    const existingDoc = await Misc.findOne({ miscid });
    if (!existingDoc) {
      return NextResponse.json({ message: 'Document not found' }, { status: 404 });
    }

    // Videos
    const hasNewVideos = newVideos.some(f => typeof f.arrayBuffer === 'function');
    if (hasNewVideos) {
      // Delete old files from public
      if (existingDoc.videos?.length > 0) {
        for (const old of existingDoc.videos) {
          const fullPath = path.join(process.cwd(), 'public', old);
          await fs.unlink(fullPath).catch(() => {});
        }
      }
      // Save new
      for (const file of newVideos) {
        if (typeof file.arrayBuffer === 'function') {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const ext = path.extname(file.name);
          const filename = `vid-${uuidv4().split('-')[0]}${ext}`;
          const filepath = path.join(process.cwd(), 'public', filename);
          await fs.writeFile(filepath, buffer);
          Vid.push(filename);
        }
      }
      updateFields.videos = Vid;
    }

    // Images
    const hasNewImages = newImages.some(f => typeof f.arrayBuffer === 'function');
    if (hasNewImages) {
      if (existingDoc.images?.length > 0) {
        for (const old of existingDoc.images) {
          const fullPath = path.join(process.cwd(), 'public', old);
          await fs.unlink(fullPath).catch(() => {});
        }
      }
      for (const file of newImages) {
        if (typeof file.arrayBuffer === 'function') {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const ext = path.extname(file.name);
          const filename = `img-${uuidv4().split('-')[0]}${ext}`;
          const filepath = path.join(process.cwd(), 'public', filename);
          await fs.writeFile(filepath, buffer);
          Img.push(filename);
        }
      }
      updateFields.images = Img;
    }

    // Promo
    if (promoPercentage) {
      promo.percentage = Number(promoPercentage);
    }

    if (promoImage && typeof promoImage.arrayBuffer === 'function') {
      if (existingDoc?.promo?.image) {
        const fullPath = path.join(process.cwd(), 'public', existingDoc.promo.image);
        await fs.unlink(fullPath).catch(() => {});
      }
      const bytes = await promoImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(promoImage.name);
      const filename = `promo-${uuidv4().split('-')[0]}${ext}`;
      const filepath = path.join(process.cwd(), 'public', filename);
      await fs.writeFile(filepath, buffer);
      promo.image = filename;
    }

    if (Object.keys(promo).length > 0) {
      updateFields.promo = promo;
    }

  const COMENTS = existingDoc.comments || [];

  if (comments) {
    try {
      const parsedComments = JSON.parse(comments);

      if (Array.isArray(parsedComments) && parsedComments.length > 0) {
        // Detect if comments are objects or strings
        const isObjectComment = typeof parsedComments[0] === 'object';

        let newComments;

        if (isObjectComment) {
          // Compare JSON stringified objects
          const existingStrings = COMENTS.map(c => JSON.stringify(c));
          newComments = parsedComments.filter(
            com => !existingStrings.includes(JSON.stringify(com))
          );
        } else {
          // Compare primitive (e.g., string) comments
          newComments = parsedComments.filter(com => !COMENTS.includes(com));
        }

        if (newComments.length > 0) {
          updateFields.comments = [...COMENTS, ...newComments];
        }
      }
    } catch (err) {
      console.warn('Invalid comments JSON', err);
    }
  }


    // Final DB update
    if (Object.keys(updateFields).length > 0) {
      await Misc.updateOne({ miscid }, { $set: updateFields });
    }

    return NextResponse.json({ message: 'successful' }, { status: 200 });

  } catch (err) {

    return NextResponse.json({ message: 'error' }, { status: 500 });
  }
}


// DELETE
export async function DELETE(request) {
  await DbConnect();

  try {
    const cookieStore = cookies(); // no await needed
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
    }

    const decode = verifyToken(token);
    if (decode.apikey !== process.env.API_KEY) {
      return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
    }

    const { miscid, comment, userName } = await request.json();

    if (!miscid || !comment || !userName) {
      return NextResponse.json(
        { message: 'miscid, comment, and userName are required' },
        { status: 400 }
      );
    }

    const existingDoc = await Misc.findOne({ miscid });
    if (!existingDoc) {
      return NextResponse.json({ message: 'Document not found' }, { status: 404 });
    }

    // Filter out matching comment
    const updatedComments = existingDoc.comments.filter(
      c =>
        !(
          c.comment === comment &&
          c.userName.toLowerCase() === userName.toLowerCase()
        )
    );

    if (updatedComments.length === existingDoc.comments.length) {
      return NextResponse.json(
        { message: 'No matching comment found' },
        { status: 404 }
      );
    }

    // Save updated comments
    existingDoc.comments = updatedComments;
    await existingDoc.save();

    return NextResponse.json(
      { message: 'Comment deleted successfully' },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
