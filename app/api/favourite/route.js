import DbConnect from "@/lib/db";
import User from "@/models/user";
import Favourite from '@/models/favourite'
import Product from '@/models/product'
import { NextResponse } from "next/server";
import { verifyToken} from "@/lib/auth";
import { cookies } from "next/headers";



export async function GET(request){
    await DbConnect();
    const token = (await cookies()).get('token')?.value;
    const decode = verifyToken(token);
    if (!decode){
        return NextResponse.json({message:'unauthorized'},{ status: 401 });
    }
    else{
        try{
            const favouriteItems = await Favourite.aggregate([
                {$match :decode.userid},
                {$lookup:{
                    from:'products',
                    localField:'',
                    foreignField:'',
                    as:'items',
                }},
                {$unwind:{$items}},
                {$sort:{createdAt:-1}}

            ]);
            return NextResponse.json(favouriteItems);

        }catch(error){
            return NextResponse.json({error:"internalserver error"})
        }

    }

}