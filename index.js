import express from "express";
import connectDB from "./utils/connectDB.js";
import { configDotenv } from "dotenv";
import userRouters from "./routes/userRoutes.js";
import productRouters from "./routes/productsRoutes.js";
import reviewRouters from "./routes/reviewsRoutes.js";
import cors from "cors";

const app = express();

configDotenv();
const port = 3000;
connectDB();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Test Page");
});

app.use("/auth", userRouters);
app.use("/products", productRouters);
app.use("/reviews", reviewRouters);

app.listen(3000, () => {
  console.log(`Server is running on ${port}`);
});
