const express = require('express');
const authRoute = express.Router();
const connection = require('../db/database.js');

// Customer Signup endpoint
// Expects: { username, password, ... }
authRoute.post('/signup', async (req, res) => {
    console.log('Received signup request:', req.body);
    const {
        email, firstName, lastName,
        password, confirmPassword,
        buildingNum, street,
        city, state, zip,
        passportNum, passportExpiration, passportCountry,
        dateOfBirth
    } = req.body;
    // Checks if all fields are provided
    if (!email || !firstName || !lastName || !password || !buildingNum || !street || !city || !state || !zip || !passportNum || !passportExpiration || !passportCountry || !dateOfBirth) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    // console.log('Passes field check.');
    // Check if user exists
    connection.query('SELECT * FROM Customer WHERE Email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        if (results.length > 0) {
            return res.status(409).json({ message: 'Email already exists.' });
        }
        
        connection.query(
            'INSERT INTO Customer (Email, First_Name, Last_Name, Password, Building_Num, Street, City, State, Zip, Passport_Num, Passport_Exp, Passport_Country, Date_Of_Birth) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [email, firstName, lastName, password, buildingNum, street, city, state, zip, passportNum, passportExpiration, passportCountry, dateOfBirth],
            (err, results) => {
                if (err) return res.status(500).json({ message: 'Database error.' });
                console.log('User created successfully.');
            }
        );
    });
});

// Customer Login endpoint
// Expects: { username, password }
authRoute.post('/login', (req, res) => {
    console.log('Received login request:', req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    connection.query('SELECT * FROM Customer WHERE Email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const user = results[0];
        if (password !== user.Password) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        // For simplicity, just return a success message. In production, use JWT/session.
        res.status(200).json({ message: 'Login successful.' });
    });
});

module.exports = authRoute;
