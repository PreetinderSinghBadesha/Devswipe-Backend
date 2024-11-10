const express = require('express');
const userRouter = express.Router();
const User = require('../models/User');
const verifyToken = require('../middlewares/jwtMiddleware');

userRouter.get('/get-users', verifyToken, async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users"});
    }
});


module.exports = userRouter;