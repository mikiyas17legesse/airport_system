const express = require('express');
const guestRoute = express.Router();
const connection = require('../db/database.js');

// GET /api/guest/view-flights
// Public endpoint for guests to view available flights (optionally filterable)
guestRoute.get('/view-flights', (req, res) => {
    const { source, destination, departureDate, returnDate, roundTrip } = req.query;
    let query = 'SELECT * FROM Flight WHERE Status = "Upcoming"';
    let params = [];

    if (source) {
        query += ' AND Source = ?';
        params.push(source);
    }
    if (destination) {
        query += ' AND Destination = ?';
        params.push(destination);
    }
    if (departureDate) {
        query += ' AND Date = ?';
        params.push(departureDate);
    }

    connection.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        // For round trip, fetch return flights as well
        if (roundTrip && destination && source && returnDate) {
            const returnQuery = 'SELECT * FROM Flight WHERE Status = "Upcoming" AND Source = ? AND Destination = ? AND Date = ?';
            const returnParams = [destination, source, returnDate];
            connection.query(returnQuery, returnParams, (err2, returnResults) => {
                if (err2) return res.status(500).json({ message: 'Database error.' });
                return res.status(200).json({ outboundFlights: results, returnFlights: returnResults });
            });
        } else {
            return res.status(200).json({ outboundFlights: results });
        }
    });
});

module.exports = guestRoute;
