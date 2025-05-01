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

customerRoute.post('/purchase-ticket', async (req, res) => {
  const {
    airlineName, flightNum,departDate, departTime,cardNum, 
    expDate, nameOnCard, cardType, firstName, lastName
  } = req.body;

  // Validate required fields
  if (!airlineName || !flightNum || !departDate || !departTime || !cardNum || 
      !expDate || !nameOnCard || !cardType || !firstName || !lastName) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const customerEmail = req.user.email;
  const transactionId = `tx_${Date.now()}`;
  
  try {
    await connection.beginTransaction();
    
    // Get flight capacity and current bookings
    const [flightInfo] = await connection.query(`
      SELECT F.Base_Price, A.Num_Of_Seats, A.ID AS Airplane_ID
      FROM Flight F
      JOIN Airplane A ON F.Airline_Name = A.Airline_Name AND F.Airplane_ID = A.ID
      WHERE F.Airline_Name = ? AND F.Flight_Num = ? AND F.Depart_Date = ? AND F.Depart_Time = ?
    `, [airlineName, flightNum, departDate, departTime]);

    if (flightInfo.length === 0) {
      return res.status(404).json({ 
        error: 'Flight not found',
        transactionId,
        details: { airlineName, flightNum, departDate, departTime }
      });
    }

    const { Base_Price, Num_Of_Seats, Airplane_ID } = flightInfo[0];
    
    // Get booked seats and available seat numbers
    const [bookedSeats] = await connection.query(`
      SELECT Seat_Num
      FROM Ticket
      WHERE Airline_Name = ? AND Flight_Num = ? AND Depart_Date = ? AND Depart_Time = ?
    `, [airlineName, flightNum, departDate, departTime]);
    
    if (bookedSeats.length >= Num_Of_Seats) {
      return res.status(400).json({ 
        error: 'Flight is fully booked',
        transactionId,
        capacity: Num_Of_Seats,
        booked: bookedSeats.length
      });
    }

    // Calculate dynamic pricing
    const occupancyRate = bookedSeats.length / Num_Of_Seats;
    const finalPrice = (occupancyRate >= 0.6) 
      ? parseFloat(Base_Price) * 1.2 
      : parseFloat(Base_Price);

    // Generate seat number (first available)
    const allSeats = Array.from({length: Num_Of_Seats}, (_, i) => i + 1);
    const takenSeats = new Set(bookedSeats.map(s => s.Seat_Num));
    const availableSeat = allSeats.find(seat => !takenSeats.has(seat));

    // Insert ticket with seat assignment
    const [ticketResult] = await connection.query(`
      INSERT INTO Ticket (
        Airline_Name, Flight_Num, Depart_Date, Depart_Time, 
        Sold_Price, Seat_Num, Customer_Email, Airplane_ID
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING Ticket_ID
    `, [
      airlineName, flightNum, departDate, departTime, 
      finalPrice, availableSeat, customerEmail, Airplane_ID
    ]);
    
    const ticketId = ticketResult[0].Ticket_ID;

    // Record purchase
    await connection.query(`
      INSERT INTO Purchase (
        Ticket_ID, Customer_Email, Purchase_Date, Purchase_Time,
        Card_Num, Exp_Date, Name_On_Card, Card_Type, First_Name, Last_Name
      ) VALUES (?, ?, CURRENT_DATE, CURRENT_TIME, ?, ?, ?, ?, ?, ?)
    `, [
      ticketId, customerEmail,
      cardNum, expDate, nameOnCard, cardType,
      firstName, lastName
    ]);

    await connection.commit();
    res.json({ 
      message: 'Ticket booked successfully', 
      ticketId, 
      finalPrice,
      seatNumber: availableSeat,
      transactionId
    });

  } catch (err) {
    await connection.rollback();
    console.error(`[${transactionId}] Booking failed:`, err);
    res.status(500).json({ 
      error: 'Failed to complete booking',
      transactionId,
      details: err.message
    });
  }
});

customerRoute.post('/cancel-ticket', (req, res) => {});

customerRoute.post('/rate-flight', (req, res) => {});

module.exports = customerRoute;