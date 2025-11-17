const express = require("express");
const router = express.Router();
const axios = require("axios");

// NEW HuggingFace endpoint (IMPORTANT)
const HF_API_URL = "https://router.huggingface.co/hf-inference";

async function callHuggingFace(imageBase64) {
  try {
    const res = await axios.post(
      HF_API_URL,
      {
        model: "Salesforce/blip-image-captioning-base",
        inputs: imageBase64
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return res.data;
  } catch (err) {
    console.log("HF ERROR:", err.response?.data || err.message);
    throw err;
  }
}

router.post("/analyze-image", async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Image missing" });
    }

    let result = await callHuggingFace(image);

    // Handle "model loading" case
    if (result.error && result.error.includes("loading")) {
      console.log("Model loading... retrying in 4 seconds...");
      await new Promise(r => setTimeout(r, 4000));
      result = await callHuggingFace(image);
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: "AI failed",
      details: err.response?.data || err.message
    });
  }
});

module.exports = router;
