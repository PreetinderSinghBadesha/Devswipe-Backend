const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const verifyToken = require('../middlewares/jwtMiddleware');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save(); 
        res.status(200).json({
            message: 'User Successfully Added'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Registration Failed'
        })
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        });
        if (!user) {
            return res.status(401).json({ error: "Authentication failed" });
        }
        const passwordMatched = await bcrypt.compare(password, user.password);
        if (!passwordMatched) {
            return res.status(401).json({ error: "Authentication failed" });
        }
        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: '10d' }
        );
        res.status(200).json({token: token});
    } catch (error) {
        res.status(500).json({error: "Login failed"});
    }
});


router.post('/verify-login', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ error: "No token given"});
        try {
            const decodedToken = jwt.verify(token, JWT_SECRET);
            res.status(200).json({ tokenDetails: decodedToken });
        } catch (error) {
            res.status(401).json({ error: "Invalid Token" });
        }
    } catch (error) {
        res.status(500).json({ 
            error: "Failed to verify token",
            details: error.message
        })
    }
});

module.exports = router;