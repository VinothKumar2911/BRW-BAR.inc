const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");




// SIGNUP
router.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    // CHECK IF USER EXISTS
    const exists = await User.findOne({ email });
    if (exists) {
        return res.json({ success: false, message: "Email already exists" });
    }

    // HASH PASSWORD
    const passwordHash = await bcrypt.hash(password, 10);

    // SAVE USER
    await User.create({
        email,
        passwordHash,
        createdAt: new Date()
    });

    res.json({ success: true, message: "Signup successful" });
});

// LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
        return res.json({ success: false, message: "User not found" });

    // CHECK HASHED PASSWORD
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
        return res.json({ success: false, message: "Incorrect password" });

    res.json({ success: true, message: "Login successful" });
});

module.exports = router;
