import express from "express";
import connectDB from "./utils/connectDB.js";
import { configDotenv } from "dotenv";
import userRouters from "./routes/userRoutes.js";

const app = express();

configDotenv();
const port = 3000;
connectDB()

// Middlewares
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Test Page");
});

app.use("/users", userRouters);

app.listen(3000, () => {
  console.log(`Server is running on ${port}`);
});
