const express = require('express');
const authRoute = express.Router();
const connection = require('server/src/db/database.js');
const bcrypt = require('bcrypt');

// Customer Signup endpoint
// Expects: { username, password, ... }
authRoute.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    try {
        // Check if user exists
        connection.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
            if (err) return res.status(500).json({ message: 'Database error.' });
            if (results.length > 0) {
                return res.status(409).json({ message: 'Username already exists.' });
            }
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            // Insert user
            connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, results) => {
                if (err) return res.status(500).json({ message: 'Database error.' });
                res.status(201).json({ message: 'User created successfully.' });
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// Customer Login endpoint
// Expects: { username, password }
authRoute.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    connection.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        // For simplicity, just return a success message. In production, use JWT/session.
        res.status(200).json({ message: 'Login successful.' });
    });
});

module.exports = authRoute;
