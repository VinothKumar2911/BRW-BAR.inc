require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- AI Routes MUST COME FIRST ----
const sentimentRoutes = require("./routes/sentiment");
const recommendRoutes = require("./routes/recommend");

app.use("/ai", sentimentRoutes);
app.use("/ai", recommendRoutes);

// ---- Other Routes ----
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");

app.use("/auth", authRoutes);
app.use("/products", productRoutes);

// MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.get("/", (req, res) => res.send("Backend Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));

const aiImageRoutes = require("./routes/aiImage");
app.use("/ai", aiImageRoutes);

