const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('../middlewares/jwtMiddleware');

// Fetch current user's profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({ error: "Invalid token or user ID" });
        }

        const user = await User.findById(userId).select('-password -__v');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            message: "User profile fetched successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch profile",
            details: error.message
        });
    }
});

// Fetch user by userId
router.get('/user/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.params.id;

        // Validate the provided userId
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const user = await User.findById(userId).select('-password -__v');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            message: "User fetched successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch user",
            details: error.message
        });
    }
});

module.exports = router;
