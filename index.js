import express from "express";

const app = express();

const port = 3000;

app.get("/", (req, res) => {
  res.send("Test Page");
});

app.listen(3000, () => {
  console.log(`Server is running on ${port}`);
});
