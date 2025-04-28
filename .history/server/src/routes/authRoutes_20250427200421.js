const express = require('express');
const authRoute = express.Router();
const connection = require('../db/database.js');

// Customer Signup endpoint
// Expects: { username, password, ... }
authRoute.post('/customer-signup', async (req, res) => {
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
authRoute.post('/customer-login', (req, res) => {
    console.log('Received login request:', req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    connection.query('SELECT * FROM Customer WHERE Email = ? AND Password = ?', [email, password], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        res.status(200).json({ message: 'Login successful.' });
    });
});

// Staff Signup endpoint
// Expects: { username, password, ... } 
authRoute.post('/staff-signup', (req, res) => {
    const {
        username, firstName, lastName,
        password, confirmPassword,
        email, phoneNumber, dateOfBirth, airlineName
    } = req.body;

    if (!username || !password || !email || !phoneNumber || !dateOfBirth || !airlineName || !firstName || !lastName || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
    }

    // Check if staff exists
    connection.query('SELECT * FROM Airline_Staff WHERE Username = ?', [username], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        if (results.length > 0) {
            return res.status(409).json({ message: 'Username already exists.' });
        }

        // Check if airline exists
        connection.query('SELECT * FROM Airline WHERE Name = ?', [airlineName], (err, airlineResults) => {
            if (err) return res.status(500).json({ message: 'Database error.' });

            const proceedWithStaffInsert = () => {
                connection.query(
                    'INSERT INTO Airline_Staff (Username, Password, First_Name, Last_Name, Date_Of_Birth, Airline_Name) VALUES (?, ?, ?, ?, ?, ?)',
                    [username, password, firstName, lastName, dateOfBirth, airlineName],
                    (err, results) => {
                        if (err) {
                            console.log('DB error:', err);
                            return res.status(500).json({ message: 'Database error.' });
                        }
                        // Insert into Airline_Staff_Email
                        connection.query(
                            'INSERT INTO Airline_Staff_Email (Username, Email) VALUES (?, ?)',
                            [username, email],
                            (err, results) => {
                                if (err) return res.status(500).json({ message: 'Database error.' });
                                // Insert into Airline_Staff_Phone
                                connection.query(
                                    'INSERT INTO Airline_Staff_Phone (Username, Phone_Number) VALUES (?, ?)',
                                    [username, phoneNumber],
                                    (err, results) => {
                                        if (err) return res.status(500).json({ message: 'Database error.' });
                                        // Success!
                                        return res.status(201).json({ success: true, message: 'Staff account created successfully.' });
                                    }
                                );
                            }
                        );
                    }
                );
            };

            if (airlineResults.length === 0) {
                connection.query('INSERT INTO Airline (Name) VALUES (?)', [airlineName], (err, insertResults) => {
                    if (err) return res.status(500).json({ message: 'Database error.' });
                    proceedWithStaffInsert();
                });
            } else {
                proceedWithStaffInsert();
            }
        });
    });
});

module.exports = authRoute;
