const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: "Access Denied"});
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid Token" });
    }
}

module.exports = verifyToken;