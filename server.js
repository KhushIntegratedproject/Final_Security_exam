const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();

app.use(express.json());

const allowedOrigins = ['http://localhost:5500', 'http://127.0.0.1:5500'];
app.use(cors({
    origin: allowedOrigins
}));

const SECRET_KEY = 'wmdd-4950-cloud-security-final-2025';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }
        next(); // Token is valid
    });
}

app.get('/private', authenticateToken, (req, res) => {
    return res.status(200).json({ message: "Welcome! You are accessing private data" });
});


app.get('/public', (req, res) => {
    return res.status(200).json({ message: "Welcome! Everyone is authorized for this endpoint" });
});


app.get('', (req, res) => {
    return res.status(404).json({ message: "Resource Not Found" });
});

app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message,
        details: err.details || null
    });
});

app.listen(4050, () => console.log('Server running on port 4050 - http://localhost:4050'));
