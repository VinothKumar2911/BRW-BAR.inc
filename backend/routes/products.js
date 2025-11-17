const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Fetch all products
router.get("/", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Fetch by category
router.get("/category/:cat", async (req, res) => {
    const cat = req.params.cat;
    const products = await Product.find({ category: cat });
    res.json(products);
});

module.exports = router;
