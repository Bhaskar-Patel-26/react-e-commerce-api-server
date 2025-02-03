import { Schema, model } from "mongoose";
import { User } from "../models/userModel.js";
import { Products } from "../models/productsModel.js";

const ReviewSchema = new Schema(
  {
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: User, required: true },
    ProductId: { type: Schema.Types.ObjectId, ref: Products, required: true },
  },
  { timestamps: true }
);

export const Reviews = model("Review", ReviewSchema);
