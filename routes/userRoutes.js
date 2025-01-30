import express from "express";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.get("/test", (req, res) => {
  res.status(200).send("User route");
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, username, password: hashedPassword });
    await user.save();
    res.status(200).send({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.status(200).send({ message: "User login successfully!" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
    console.log(error);
  }
});

export default router;
