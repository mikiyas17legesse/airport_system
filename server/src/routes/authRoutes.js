const express = require('express');
const authRoute = express.Router();
const connection = require('../db/database.js');

// Customer Signup endpoint
// Expects: { username, password, ... }
authRoute.post('/customer-signup', async (req, res) => {
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
        if (err) {
            console.error('MySQL Error Details:', {
                code: err.code,
                errno: err.errno,
                sqlMessage: err.sqlMessage,
                sqlState: err.sqlState,
                sql: err.sql
            });
            return res.status(500).json({ 
                success: false,
                message: 'Database operation failed',
                details: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        }
        if (results.length > 0) {
            return res.status(409).json({ message: 'Email already exists.' });
        }
        
        connection.query(
            'INSERT INTO Customer (Email, First_Name, Last_Name, Password, Building_Num, Street, City, State, Zip, Passport_Num, Passport_Exp, Passport_Country, Date_Of_Birth) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [email, firstName, lastName, password, buildingNum, street, city, state, zip, passportNum, passportExpiration, passportCountry, dateOfBirth],
            (err, results) => {
                if (err) {
                    console.error('MySQL Error Details:', {
                        code: err.code,
                        errno: err.errno,
                        sqlMessage: err.sqlMessage,
                        sqlState: err.sqlState,
                        sql: err.sql
                    });
                    return res.status(500).json({ 
                        success: false,
                        message: 'Database operation failed',
                        details: process.env.NODE_ENV === 'development' ? err.message : undefined
                    });
                }
                console.log('User created successfully.');
            }
        );
    });
});

// Customer Login endpoint
authRoute.post('/customer-login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    connection.query('SELECT * FROM Customer WHERE Email = ? AND Password = ?', [email, password], (err, results) => {
        if (err) {
            console.error('MySQL Error Details:', {
                code: err.code,
                errno: err.errno,
                sqlMessage: err.sqlMessage,
                sqlState: err.sqlState,
                sql: err.sql
            });
            return res.status(500).json({ 
                success: false,
                message: 'Database operation failed',
                details: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        }
        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
        res.status(200).json({ success: true, message: 'Login successful.' });
    });
});

// Staff Signup endpoint
authRoute.post('/staff-signup', (req, res) => {
    const {
        username, firstName, lastName,
        password, confirmPassword,
        email, phoneNumber, dateOfBirth, airlineName
    } = req.body;

    if (!username || !password || !email || !phoneNumber || !dateOfBirth || !airlineName || !firstName || !lastName || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    // Check if staff exists
    connection.query('SELECT * FROM Airline_Staff WHERE Username = ?', [username], (err, results) => {
        if (err) {
            console.error('MySQL Error Details:', {
                code: err.code,
                errno: err.errno,
                sqlMessage: err.sqlMessage,
                sqlState: err.sqlState,
                sql: err.sql
            });
            return res.status(500).json({ 
                success: false,
                message: 'Database operation failed',
                details: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        }
        if (results.length > 0) {
            return res.status(409).json({ message: 'Username already exists.' });
        }

        connection.query('SELECT * FROM Airline WHERE Name = ?', [airlineName], (err, airlineResults) => {
            if (err) {
                console.error('MySQL Error Details:', {
                    code: err.code,
                    errno: err.errno,
                    sqlMessage: err.sqlMessage,
                    sqlState: err.sqlState,
                    sql: err.sql
                });
                return res.status(500).json({ 
                    success: false,
                    message: 'Database operation failed',
                    details: process.env.NODE_ENV === 'development' ? err.message : undefined
                });
            }

            const proceedWithStaffInsert = () => {
                connection.query(
                    'INSERT INTO Airline_Staff (Username, Password, First_Name, Last_Name, Date_Of_Birth, Airline_Name) VALUES (?, ?, ?, ?, ?, ?)',
                    [username, password, firstName, lastName, dateOfBirth, airlineName],
                    (err, results) => {
                        if (err) {
                            console.error('MySQL Error Details:', {
                                code: err.code,
                                errno: err.errno,
                                sqlMessage: err.sqlMessage,
                                sqlState: err.sqlState,
                                sql: err.sql
                            });
                            return res.status(500).json({ 
                                success: false,
                                message: 'Database operation failed',
                                details: process.env.NODE_ENV === 'development' ? err.message : undefined
                            });
                        }
                        connection.query(
                            'INSERT INTO Airline_Staff_Email (Username, Email) VALUES (?, ?)',
                            [username, email],
                            (err, results) => {
                                if (err) {
                                    console.error('MySQL Error Details:', {
                                        code: err.code,
                                        errno: err.errno,
                                        sqlMessage: err.sqlMessage,
                                        sqlState: err.sqlState,
                                        sql: err.sql
                                    });
                                    return res.status(500).json({ 
                                        success: false,
                                        message: 'Database operation failed',
                                        details: process.env.NODE_ENV === 'development' ? err.message : undefined
                                    });
                                }
                                connection.query(
                                    'INSERT INTO Airline_Staff_Phone (Username, Phone_Number) VALUES (?, ?)',
                                    [username, phoneNumber],
                                    (err, results) => {
                                        if (err) {
                                            console.error('MySQL Error Details:', {
                                                code: err.code,
                                                errno: err.errno,
                                                sqlMessage: err.sqlMessage,
                                                sqlState: err.sqlState,
                                                sql: err.sql
                                            });
                                            return res.status(500).json({ 
                                                success: false,
                                                message: 'Database operation failed',
                                                details: process.env.NODE_ENV === 'development' ? err.message : undefined
                                            });
                                        }
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
                    if (err) {
                        console.error('MySQL Error Details:', {
                            code: err.code,
                            errno: err.errno,
                            sqlMessage: err.sqlMessage,
                            sqlState: err.sqlState,
                            sql: err.sql
                        });
                        return res.status(500).json({ 
                            success: false,
                            message: 'Database operation failed',
                            details: process.env.NODE_ENV === 'development' ? err.message : undefined
                        });
                    }
                    proceedWithStaffInsert();
                });
            } else {
                proceedWithStaffInsert();
            }
        });
    });
});

// Staff Login endpoint
authRoute.post('/staff-login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    connection.query('SELECT * FROM Airline_Staff WHERE Username = ? AND Password = ?', [username, password], (err, results) => {
        if (err) {
            console.error('MySQL Error Details:', {
                code: err.code,
                errno: err.errno,
                sqlMessage: err.sqlMessage,
                sqlState: err.sqlState,
                sql: err.sql
            });
            return res.status(500).json({ 
                success: false,
                message: 'Database operation failed',
                details: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        res.status(200).json({ 
            success: true, 
            message: 'Login successful.',
            redirectTo: '/staff-home'
        }); 
    });
});

module.exports = authRoute;