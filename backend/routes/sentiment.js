const express = require("express");
const router = express.Router();
const Sentiment = require("sentiment");
const sentiment = new Sentiment();

router.post("/analyze", (req, res) => {
    const { review } = req.body;

    if (!review) {
        return res.json({ success: false, message: "Review text is required" });
    }

    const result = sentiment.analyze(review);

    let label = "neutral";
    if (result.score > 2) label = "positive";
    else if (result.score < -2) label = "negative";

    res.json({
        success: true,
        sentiment: label,
        score: result.score
    });
});

module.exports = router;
