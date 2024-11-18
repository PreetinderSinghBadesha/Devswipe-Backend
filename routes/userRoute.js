const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('../middlewares/jwtMiddleware');

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

router.get('/user/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.params.id;

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


router.put('/update', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({ error: "Invalid token or user ID" });
        }

        const updateFields = req.body;
        const allowedFields = [
            "username", "email", "college", "about", "rating", "profilePicture",
            "DOB", "phoneNum", "coins", "socials", "skills", "projects", "hackathons"
        ];

        const filteredFields = {};
        Object.keys(updateFields).forEach(key => {
            if (allowedFields.includes(key)) {
                filteredFields[key] = updateFields[key];
            }
        });

        const updatedUser = await User.findByIdAndUpdate(userId, filteredFields, {
            new: true,
            runValidators: true, 
        }).select('-password -__v');

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            message: "User data updated successfully",
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to update user data",
            details: error.message
        });
    }
});

module.exports = router;
