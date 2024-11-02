const express = require('express');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT

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

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT} ....`)
});

app.get("/", (req, res) => {
    res.send("Ping !!!")
});
