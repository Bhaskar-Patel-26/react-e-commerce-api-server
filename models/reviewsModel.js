import { Schema, model } from "mongoose";
import { User } from "../models/userModel.js";
import { Product } from "../models/productsModel.js";

const ReviewSchema = new Schema(
  {
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: User, required: true },
    productId: { type: Schema.Types.ObjectId, ref: Product, required: true },
  },
  { timestamps: true }
);

export const Reviews = model("Review", ReviewSchema);
