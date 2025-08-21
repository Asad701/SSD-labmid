import { verifyToken } from "@/lib/auth";
import DbConnect from "@/lib/db";
import Product from "@/models/product";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import path from "path";
import fs from "fs/promises";
import { cookies } from "next/headers";

// -------------------------
// GET /api/products?search=abc OR ?category=xyz
// -------------------------
export async function GET(request) {
  await DbConnect();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const category = searchParams.get("category");

  try {
    let products;
    if (search) {
      products = await Product.find({
                    $or: [
                      { title: { $regex: search, $options: "i" } },
                      { productid: { $regex: search, $options: "i" } }
                    ]
                  }).sort({ _id: -1 });
    } else if (category) {
      products = await Product.find({ category: { $in: [category] } }).sort({_id: -1});
    } else {
      products = await Product.find({}).sort({_id: -1});
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "internal servet error" }, { status: 500 });
  }
}

// -------------------------
// POST /api/products (multipart/form-data)
// -------------------------
export async function POST(request) {
  await DbConnect();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const decoded = verifyToken(token);
  if (decoded.apikey !== process.env.API_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const slug = formData.get("slug");
    const dimension = formData.get("dimension");
    const description = formData.get("description");
    const price = Number(formData.get("price"));
    const discount = Number(formData.get("discount"));

    // --- Fixed category parsing ---
    let category = [];
    try {
      category = formData.getAll("category");
      if (category.length === 1) {
        const single = category[0];
        if (typeof single === "string" && single.trim().startsWith("[")) {
          category = JSON.parse(single);
        } else if (typeof single === "string" && single.includes(",")) {
          category = single.split(",").map(c => c.trim()).filter(Boolean);
        }
      }
    } catch {
      category = [];
    }

    const tags = formData.get("tags")?.split(",") || [];
    const mainImage = formData.get("mainimage");
    const gallery = formData.getAll("gallery");
    const colors = formData.getAll("colors");

    if (!title || !slug || !description || !price || !category.length || !mainImage) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const productid = `product-${uuid().split("-")[0]}`;

    // Save main image
    const mainBuffer = Buffer.from(await mainImage.arrayBuffer());
    const mainExt = path.extname(mainImage.name);
    const mainFilename = `product-${uuid().split("-")[0]}${mainExt}`;
    await fs.writeFile(path.join(process.cwd(), "public", mainFilename), mainBuffer);

    // Save gallery images
    const galleryImages = [];
    for (const image of gallery) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const ext = path.extname(image.name);
      const filename = `product-${uuid().split("-")[0]}${ext}`;
      await fs.writeFile(path.join(process.cwd(), "public", filename), buffer);
      galleryImages.push(filename);
    }

    const newProduct = new Product({
      productid,
      title,
      slug,
      dimension,
      description,
      price,
      discount,
      category,
      tags,
      mainimage: mainFilename,
      gallery: galleryImages,
      colors,
    });
    const result = await newProduct.save();
    return NextResponse.json({ message: "Product created successfully", product: result });
  } catch (error) {
    return NextResponse.json({ message: "Failed to create product"}, { status: 500 });
  }
}


// -------------------------
// PATCH /api/products (update with FormData)
// -------------------------
export async function PATCH(request) {
  await DbConnect();
  const formData = await request.formData();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded || decoded.apikey !== process.env.API_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const productId = formData.get("productid");
    const product = await Product.findOne({ productid: productId });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Update fields
    ["title", "description", "price", "discount"].forEach((field) => {
      if (formData.get(field)) product[field] = formData.get(field);
    });

    // Main image
    if (formData.get("mainimage")) {
      const oldPath = path.join(process.cwd(), "public", product.mainimage);
      try {
        await fs.unlink(oldPath);
      } catch (err) {
        console.warn("Failed to delete old main image:");
      }

      const file = formData.get("mainimage");
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name);
      const filename = `product-${uuid().split("-")[0]}${ext}`;
      const newPath = path.join(process.cwd(), "public", filename);
      await fs.writeFile(newPath, buffer);
      product.mainimage = filename;
    }

    // Gallery images
    if (formData.getAll("gallery").length > 0) {
      for (const img of product.gallery || []) {
        const pathToDelete = path.join(process.cwd(), "public", img);
        try {
          await fs.unlink(pathToDelete);
        } catch (err) {
          return NextResponse.json({ message :"Error deleting gallery image"});
        }
      }

      const newGallery = [];
      for (const image of formData.getAll("gallery")) {
        const buffer = Buffer.from(await image.arrayBuffer());
        const ext = path.extname(image.name);
        const filename = `product-${uuid().split("-")[0]}${ext}`;
        await fs.writeFile(path.join(process.cwd(), "public", filename), buffer);
        newGallery.push(filename);
      }
      product.gallery = newGallery;
    }

    await product.save();
    return NextResponse.json({ message: "Product updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Update failed"}, { status: 500 });
  }
}

// -------------------------
// DELETE /api/products
// -------------------------
// -------------------------
// DELETE /api/products
// -------------------------
export async function DELETE(request) {
  await DbConnect();
  const { pid } = await request.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded || decoded.apikey !== process.env.API_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1️⃣ Find product first
    const product = await Product.findOne({ productid: pid });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // 2️⃣ Delete main image
    if (product.mainimage) {
      const oldPath = path.join(process.cwd(), "public", product.mainimage);
      try {
        await fs.unlink(oldPath);
      } catch (err) {
        return NextResponse.json({ message: "internal server error" }, { status: 500 });
      }
    }

    // 3️⃣ Delete gallery images
    if (Array.isArray(product.gallery)) {
      for (const img of product.gallery) {
        const pathToDelete = path.join(process.cwd(), "public", img);
        try {
          await fs.unlink(pathToDelete);
        } catch (err) {
          return NextResponse.json({ message: "internal server error" }, { status: 500 });
        }
      }
    }

    // 4️⃣ Delete product from DB
    await Product.deleteOne({ productid: pid });

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete product", }, { status: 500 });
  }
}
