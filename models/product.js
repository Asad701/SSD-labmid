import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  productid: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  dimension: { type: String },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, required: true },
  category: { type: [String], required: true },
  tags: { type: [String], required: true },
  mainimage: { type: String, required: true },
  gallery: { type: [String], required: true },
  colors: { type: [String], default: [] },
  sellingcount: { type: Number, default: 0 },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;
