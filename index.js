const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken")
const authService = require('./services/auth');
const usersRoute = require('./routes/userRoute');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL);
const database = mongoose.connection;

app.use(cors({
    origin: ['http://localhost:3000']
}));

const checkApikey = (req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    if (apiKey && apiKey === process.env.API_KEY) {
        next();
    } else {
        res.status(403).json({ error: "Forbidden: Invalid API Key" });
    }
};


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    checkApikey(req, res, next);
});

database.on('error', (error) => {
    console.log(error);
});

database.once('connected', () => {
    console.log('Database Connected');
});

app.use('/auth', authService);
app.use('/users', usersRoute);

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT} ....`)
});

app.get("/", (req, res) => {
    res.send("Ping !!!")
});
