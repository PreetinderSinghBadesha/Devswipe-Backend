const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set in the environment variables");
}

const validateInput = (fields) => {
    for (const [key, value] of Object.entries(fields)) {
        if (!value || typeof value !== 'string' || !value.trim()) {
            return `${key} is required and must be a valid string.`;
        }
    }
    return null;
};

router.post('/register', async (req, res) => {
    try {
        const { username, email, password, coins, socials, skills, college, about, DOB, phoneNum, projects, hackathons } = req.body;

        // Input validation
        const error = validateInput({ username, email, password });
        if (error) return res.status(400).json({ error });

        const hashedPassword = await bcrypt.hash(password.trim(), 10);

        const user = new User({
            username: username.trim(),
            email: email.trim(),
            password: hashedPassword,
            coins: coins || { powerCoins: 25, achievementCoins: 25 }, // Default values
            socials: socials || {},
            skills: skills || {},
            college,
            about,
            DOB,
            phoneNum,
            projects: projects || {}, // Default empty objects
            hackathons: hackathons || {} // Default empty objects
        });

        await user.save();
        res.status(201).json({ message: 'User successfully registered.', data: user });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed.', details: error.message });
    }
});


// Login Route
router.post('/login', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Input validation
        const error = validateInput({ username, email, password });
        if (error) return res.status(400).json({ error });

        const user = await User.findOne({
            $or: [
                { username: username.trim() },
                { email: email.trim() }
            ]
        });

        if (!user) {
            return res.status(401).json({ error: "Invalid username or email." });
        }

        const passwordMatched = await bcrypt.compare(password.trim(), user.password);
        if (!passwordMatched) {
            return res.status(401).json({ error: "Invalid password." });
        }

        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: '10d' }
        );

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed.', details: error.message });
    }
});

// Verify Login Route
router.post('/verify-login', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) return res.status(401).json({ error: "No token provided." });

        try {
            const decodedToken = jwt.verify(token, JWT_SECRET);
            res.status(200).json({ tokenDetails: decodedToken });
        } catch (error) {
            res.status(401).json({ error: "Invalid or expired token." });
        }
    } catch (error) {
        res.status(500).json({
            error: "Failed to verify token.",
            details: error.message
        });
    }
});

module.exports = router;
