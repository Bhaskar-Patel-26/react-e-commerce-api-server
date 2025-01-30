import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: { type: String, require: true, unique: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  role: { type: String, default: "user" },
  profileImage: { type: String },
  bio: { type: String, maxlength: 200 },
  profession: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const User = new model("user", userSchema);