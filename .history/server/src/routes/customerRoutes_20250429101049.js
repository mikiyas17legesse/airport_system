const express = require('express');
const customerRoute = express.Router();
const connection = require('../db/database.js');

// View all future flights for the customer
customerRoute.get('/view-my-flights', async (req, res) => {
});

customerRoute.get('/past-flights', async (req, res) => {
    connection.query('SELECT * FROM Flight WHERE Date < ?', [new Date()], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        res.status(200).json({ flights: results });
    });
});
customerRoute.get('/search-flights', (req, res) => {});

customerRoute.post('/purchase-ticket', (req, res) => {});

customerRoute.post('/cancel-ticket', (req, res) => {});

customerRoute.post('/rate-flight', (req, res) => {});