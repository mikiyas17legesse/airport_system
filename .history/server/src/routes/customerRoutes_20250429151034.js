const express = require('express');
const customerRoute = express.Router();
const connection = require('../db/database.js');

// View all future flights for the customer
customerRoute.get('/view-my-flights', async (req, res) => {
});

customerRoute.get('/past-flights', async (req, res) => {
});

customerRoute.get('/search-flights', (req, res) => {
    const { tripType, source, destination, departureDate, returnDate } = req.query;
    
    if (!tripType || !source || !destination || !departureDate) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const outboundFlightQ = 'SELECT * FROM Flight WHERE Source = ? AND Destination = ? AND Date = ?';
    const outboundFlightParams = [source, destination, departureDate];
    let outboundFlights = [];
    let returnFlights = [];

    connection.query(outboundFlightQ, outboundFlightParams, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        outboundFlights = results;

        if (tripType === 'roundtrip' && returnDate) {
            const returnQuery = `
                SELECT * FROM Flight
                WHERE Source = ? AND Destination = ? AND Departure_Date = ?
            `;
            const returnParams = [destination, source, returnDate];

            connection.query(returnQuery, returnParams, (err, returnResults) => {
                if (err) return res.status(500).json({ message: 'Database error.' });

                returnFlights = returnResults;
                return res.status(200).json({ outboundFlights, returnFlights });
            });
        } else {
            return res.status(200).json({ outboundFlights });
        }
    });
});


customerRoute.post('/purchase-ticket', (req, res) => {});

customerRoute.post('/cancel-ticket', (req, res) => {});

customerRoute.post('/rate-flight', (req, res) => {});