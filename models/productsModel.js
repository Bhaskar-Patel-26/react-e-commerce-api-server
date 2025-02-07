import { Schema, model } from "mongoose";
import { User } from "../models/userModel.js";

const ProductSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String },
  description: { type: String },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  image: { type: String },
  color: { type: String },
  rating: { type: Number, default: 0 },
  author: { type: Schema.Types.ObjectId, ref: User, required: true },
});

export const Product = model("Product", ProductSchema);
