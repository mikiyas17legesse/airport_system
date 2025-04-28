const express = require('express');
const router = express.Router();
const connection = require('../database');

// Get all flights
router.get('/flights', (req, res) => {
    const query = `
        SELECT f.*, 
               a1.Name AS DepartureAirport, 
               a2.Name AS ArrivalAirport,
               al.Name AS AirlineName
        FROM Flight f
        JOIN Airport a1 ON f.Departure_Airport = a1.Airport_Code
        JOIN Airport a2 ON f.Arrival_Airport = a2.Airport_Code
        JOIN Airline al ON f.Airline_Name = al.Name
        ORDER BY f.Departure_Time ASC
    `;
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching flights:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Failed to fetch flights'
            });
        }
        res.json({ 
            success: true, 
            flights: results 
        });
    });
});

// Get flights with filters
router.get('/flights/search', (req, res) => {
    const { departure, arrival, startDate, endDate, airline } = req.query;
    
    // Default to next 30 days if no date range provided
    const defaultEndDate = new Date();
    defaultEndDate.setDate(defaultEndDate.getDate() + 30);
    
    let query = `
        SELECT f.*, 
               a1.Name AS DepartureAirport, 
               a2.Name AS ArrivalAirport,
               al.Name AS AirlineName
        FROM Flight f
        JOIN Airport a1 ON f.Departure_Airport = a1.Airport_Code
        JOIN Airport a2 ON f.Arrival_Airport = a2.Airport_Code
        JOIN Airline al ON f.Airline_Name = al.Name
        WHERE 1=1
        AND f.Departure_Time BETWEEN ? AND ?
    `;
    
    let params = [
        req.query.startDate || new Date().toISOString(),
        req.query.endDate || defaultEndDate.toISOString()
    ];
    
    if (departure) {
        query += ' AND (f.Departure_Airport = ? OR a1.City = ?)';
        params.push(departure, departure);
    }
    
    if (arrival) {
        query += ' AND (f.Arrival_Airport = ? OR a2.City = ?)';
        params.push(arrival, arrival);
    }
    
    if (airline) {
        query += ' AND f.Airline_Name = ?';
        params.push(airline);
    }
    
    query += ' ORDER BY f.Departure_Time ASC';
    
    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('Error searching flights:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Failed to search flights'
            });
        }
        res.json({ 
            success: true, 
            flights: results 
        });
    });
});

// Public flight search (no auth required)
router.get('/public/flights', (req, res) => {
    const { departure, arrival, departureDate, returnDate } = req.query;
    
    // Validate required parameters
    if (!departure || !arrival || !departureDate) {
        return res.status(400).json({ 
            success: false, 
            message: 'Departure, arrival, and departure date are required'
        });
    }
    
    // Build base query for one-way flights
    let query = `
        SELECT f.*, 
               a1.Name AS DepartureAirport, 
               a2.Name AS ArrivalAirport,
               al.Name AS AirlineName
        FROM Flight f
        JOIN Airport a1 ON f.Departure_Airport = a1.Airport_Code
        JOIN Airport a2 ON f.Arrival_Airport = a2.Airport_Code
        JOIN Airline al ON f.Airline_Name = al.Name
        WHERE (f.Departure_Airport = ? OR a1.City = ?)
        AND (f.Arrival_Airport = ? OR a2.City = ?)
        AND DATE(f.Departure_Time) = ?
        AND f.Departure_Time > NOW()
        ORDER BY f.Departure_Time ASC
    `;
    
    let params = [departure, departure, arrival, arrival, departureDate];
    
    // If return date specified, search for return flights too
    let returnFlights = [];
    if (returnDate) {
        const returnQuery = `
            SELECT f.*, 
                   a1.Name AS DepartureAirport, 
                   a2.Name AS ArrivalAirport,
                   al.Name AS AirlineName
            FROM Flight f
            JOIN Airport a1 ON f.Departure_Airport = a1.Airport_Code
            JOIN Airport a2 ON f.Arrival_Airport = a2.Airport_Code
            JOIN Airline al ON f.Airline_Name = al.Name
            WHERE (f.Departure_Airport = ? OR a1.City = ?)
            AND (f.Arrival_Airport = ? OR a2.City = ?)
            AND DATE(f.Departure_Time) = ?
            AND f.Departure_Time > NOW()
            ORDER BY f.Departure_Time ASC
        `;
        const returnParams = [arrival, arrival, departure, departure, returnDate];
        
        // Execute both queries in parallel
        Promise.all([
            new Promise((resolve, reject) => {
                connection.query(query, params, (err, results) => {
                    if (err) reject(err);
                    else resolve({ type: 'outbound', flights: results });
                });
            }),
            new Promise((resolve, reject) => {
                connection.query(returnQuery, returnParams, (err, results) => {
                    if (err) reject(err);
                    else resolve({ type: 'return', flights: results });
                });
            })
        ]).then((results) => {
            res.json({ 
                success: true, 
                outbound: results[0].flights,
                return: results[1].flights
            });
        }).catch(err => {
            console.error('Error searching flights:', err);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to search flights'
            });
        });
    } else {
        // Just one-way search
        connection.query(query, params, (err, results) => {
            if (err) {
                console.error('Error searching flights:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Failed to search flights'
                });
            }
            res.json({ 
                success: true, 
                outbound: results,
                return: []
            });
        });
    }
});

module.exports = router;
