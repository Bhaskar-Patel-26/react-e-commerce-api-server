import express from "express";
import { Product } from "../models/productsModel.js";
import { Reviews } from "../models/reviewsModel.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Create new product
router.post("/create-product", async (req, res) => {
  try {
    const newProduct = new Product({
      ...req.body,
    });
    const savedProduct = await newProduct.save();
    const reviews = await Reviews.find({ productId: savedProduct._id });
    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      const averageRating = totalRating / reviews.length;
      savedProduct.rating = averageRating;
      await savedProduct.save();
    }
    res.status(201).send(savedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Failed to create new product" });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const {category, color, minPrice, maxPrice, page=1, limit=10} = req.query;
    let filter = {};
    if(category && category !== 'all'){
        filter.category = category;
    }
    if(color && color !== 'all'){
        filter.color = color;
    }
    if(minPrice && maxPrice){
        const min = parseFloat(minPrice);
        const max = parseFloat(maxPrice);
        if(!isNaN(min) && !isNaN(max)){
            filter.price = {$gte: min, $lte: max};
        }
    }
    console.log(filter)
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalProduct = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProduct/parseInt(limit));
    const products = await Product.find(filter).skip(skip).limit(parseInt(limit)).populate("author", "email").sort({createdAt: -1});
    res.status(200).send({products, totalPages, totalProduct})
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Failed to get products" });
  }
});

// Get single product
router.get("/:id", async(req, res)=>{
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId).populate("author", "email username");
        if(!product){
            return res.status(404).send({message: "Product not found"});
        }
        const reviews = await Reviews.find({productId}).populate("userId", "username email");
        res.status(200).send({product, reviews})
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Failed to get product" });
    }
})

// Update product
router.patch("/update-product/:id", verifyToken, async (req,res)=> {
    try {
        const productId = req.params.id;
        const updatedProduct = await Product.findByIdAndUpdate(productId, {...req.body}, {new: true});
        if(!updatedProduct){
            return res.status(404).send({message: "Product not found"});
        }
        res.status(200).send({message: "Product updated successfully", product: updatedProduct})
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Failed to update product details" });
    }
})

// Delete product
router.delete("/:id", async (req,res)=> {
    try {
        const productId = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if(!deletedProduct){
            return res.status(404).send({message: "Product not found"});
        }
        await Reviews.deleteMany({productId: productId});
        res.status(200).send({message: "Product deleted successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Failed to delete product" });
    }
})

// Get related product
router.get("/related/:id", async (req,res)=> {
    try {
        const {id} = req.params;
        if(!id){
            return res.status(400).send({message: "Product ID is required"});
        }

        const product = await Product.findById(id);
        if(!product){
            return res.status(404).send({message: "Product not found"});
        }

        const titleRegex = new RegExp(
            product.name.split(" ").filter((word)=>word.length > 1).join(" "), "i"
        )

        const relatedProduct = await Product.find({
            _id: {$ne: id},
            $or: [
                {name: {$regex: titleRegex}},
                {category: product.category},
            ],
        });
        res.status(200).send(relatedProduct);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Failed to delete product" });
    }
})

export default router;
