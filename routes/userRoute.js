const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('../middlewares/jwtMiddleware');

router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password')
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

module.exports = router;