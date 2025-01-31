import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

const generateToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found!");
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    return token;
  } catch (error) {
    console.log(error);
  }
};

export default generateToken;
