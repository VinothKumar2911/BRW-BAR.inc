const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Load model.json
const modelPath = path.join(__dirname, "../ai/model.json");
let dataset = JSON.parse(fs.readFileSync(modelPath, "utf-8"));

// Convert all values to numbers
dataset = dataset.map(item => ({
    id: Number(item.id),
    price: Number(item.price),
    rating: Number(item.rating),
    category: Number(item.category)
}));

router.post("/recommend", (req, res) => {
    console.log("BODY =>", req.body);

    const price = Number(req.body.price);
    const rating = Number(req.body.rating);
    const category = Number(req.body.category);

    if (!price || !rating || !category) {
        return res.json({ success: false, message: "price, rating, category required" });
    }

    const results = dataset.map(item => {
        const dist = Math.sqrt(
            Math.pow(item.price - price, 2) +
            Math.pow(item.rating - rating, 2) +
            Math.pow(item.category - category, 2)
        );

        return { ...item, dist: Number(dist.toFixed(3)) };
    });

    results.sort((a, b) => a.dist - b.dist);

    return res.json({
        success: true,
        bestMatch: results[0],
        recommendations: results.slice(0, 3)
    });
});

module.exports = router;
