const express = require('express');
const customerRoute = express.Router();
const connection = require('../db/database.js');

// View all future flights for the customer
customerRoute.get('/view-my-flights', async (req, res) => {
    const date = new Date();
    const { email } = req.query;

    connection.query(`
        SELECT
            F.Airline_Name,
            F.Flight_Num,
            F.Depart_Date,
            F.Depart_Time,
            F.Arrival_Date,
            F.Arrival_Time,
            F.Status,
            F.Base_Price,
            T.Sold_Price,
            DA.Name AS Departure_Airport_Name,
            DA.City AS Departure_City,
            AA.Name AS Arrival_Airport_Name,
            AA.City AS Arrival_City
        FROM
            Customer C
            JOIN Purchase P ON C.Email = P.Customer_Email
            JOIN Ticket T ON P.Ticket_ID = T.Ticket_ID
            JOIN Flight F ON T.Airline_Name = F.Airline_Name
                 AND T.Flight_Num = F.Flight_Num
                 AND T.Depart_Date = F.Depart_Date
                 AND T.Depart_Time = F.Depart_Time
            JOIN Airport DA ON F.Departure_Airport = DA.Code
            JOIN Airport AA ON F.Arrival_Airport = AA.Code
        WHERE
            C.Email = ?
            AND F.Depart_Date >= ?
    `, [email, date], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    res.status(200).json(results); });
});

customerRoute.get('/past-flights', async (req, res) => {
    const date = new Date();
    const { email } = req.query;

    connection.query(`
        SELECT
            F.Airline_Name,
            F.Flight_Num,
            F.Depart_Date,
            F.Depart_Time,
            F.Arrival_Date,
            F.Arrival_Time,
            F.Status,
            F.Base_Price,
            T.Sold_Price,
            DA.Name AS Departure_Airport_Name,
            DA.City AS Departure_City,
            AA.Name AS Arrival_Airport_Name,
            AA.City AS Arrival_City
        FROM
            Customer C
            JOIN Purchase P ON C.Email = P.Customer_Email
            JOIN Ticket T ON P.Ticket_ID = T.Ticket_ID
            JOIN Flight F ON T.Airline_Name = F.Airline_Name
                 AND T.Flight_Num = F.Flight_Num
                 AND T.Depart_Date = F.Depart_Date
                 AND T.Depart_Time = F.Depart_Time
            JOIN Airport DA ON F.Departure_Airport = DA.Code
            JOIN Airport AA ON F.Arrival_Airport = AA.Code
        WHERE
            C.Email = ?
            AND F.Depart_Date < ?
    `, [email, date], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    res.status(200).json(results); });
});

customerRoute.get('/search-flights', (req, res) => {
    const { tripType, source, destination, departureDate, returnDate } = req.query;
    const today = new Date();
    const depDate = new Date(departureDate);
    console.log("Search params:", req.query);

    if (!tripType || !source || !destination || !departureDate) return res.status(400).json({ message: 'All fields are required.' });
    
    if (depDate < today) return res.status(400).json({ message: 'Departure date cannot be in the past.' });
    
    if (source === destination) return res.status(400).json({ message: 'Source and destination airports cannot be the same.' });

    const outboundFlightQ = 'SELECT * FROM Flight WHERE Departure_Airport = ? AND Arrival_Airport = ? AND Depart_Date = ? ORDER BY Depart_Time ASC';
    const outboundFlightParams = [source, destination, departureDate];
    let outboundFlights = [];
    let returnFlights = [];

    connection.query(outboundFlightQ, outboundFlightParams, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        outboundFlights = results;

        if (tripType === 'roundtrip' && returnDate) {
            const returnQuery = `
                SELECT * FROM Flight
                WHERE Departure_Airport = ? AND Arrival_Airport = ? AND Depart_Date = ?
                ORDER BY Depart_Time ASC
            `;
            const returnParams = [destination, source, returnDate];

            connection.query(returnQuery, returnParams, (err, returnResults) => {
                if (err) return res.status(500).json({ message: 'Database error.' });

                returnFlights = returnResults;
                return res.status(200).json({ outboundFlights, returnFlights });
            });
        } else {
            return res.status(200).json({ outboundFlights, returnFlights: [] });
        }
    });
});


customerRoute.post('/purchase-ticket', (req, res) => {});

customerRoute.post('/cancel-ticket', (req, res) => {});

customerRoute.post('/rate-flight', (req, res) => {});

module.exports = customerRoute;