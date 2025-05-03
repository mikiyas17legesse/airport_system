const express = require('express');
const customerRoute = express.Router();
const connection = require('../db/database.js');

// View all future flights for the customer
customerRoute.get('/view-my-flights', async (req, res) => {
    const date = new Date();
    const { email } = req.query;

    connection.query(`
        SELECT
            T.Ticket_ID,
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

customerRoute.get('/search-flights', async (req, res) => {
    const { tripType, source, destination, departureDate, returnDate } = req.query;
    const today = new Date();
    const depDate = new Date(departureDate);

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

customerRoute.post('/purchase-ticket', (req, res) => {
  const { 
    Airline_Name, Flight_Num, Depart_Date, Depart_Time, 
    cardNum, expDate, nameOnCard, cardType 
  } = req.body;
  const customer_email = req.user?.email;

  if (!customer_email || !Airline_Name || !Flight_Num || !Depart_Date || 
      !Depart_Time || !cardNum || !expDate || !nameOnCard || !cardType) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const formatExpDate = (mmYY) => {
    const [month, year] = mmYY.split('/');
    return `20${year}-${month.padStart(2, '0')}-01`;
  };

  const formattedDepartDate = new Date(Depart_Date).toISOString().split('T')[0];
  const formattedExpDate = formatExpDate(expDate);
  const cleanedCardNum = cardNum.replace(/\s/g, '');
  
  const ticket_id = Math.floor(1000 + Math.random() * 9000);
  const purchase_date = new Date().toISOString().split('T')[0];
  const purchase_time = new Date().toTimeString().split(' ')[0];

  connection.query(`
    INSERT INTO Ticket (
      Ticket_ID, Airline_Name, Flight_Num, 
      Depart_Date, Depart_Time, Sold_Price
    ) VALUES (?, ?, ?, ?, ?, ?)
  `, [ticket_id, Airline_Name, Flight_Num, 
      formattedDepartDate, Depart_Time, req.body.Base_Price || 350], 
  (ticketErr) => {
    if (ticketErr) {
      console.error('Ticket creation error:', ticketErr);
      return res.status(500).json({ error: 'Failed to create ticket' });
    }

    connection.query(`
      INSERT INTO Purchase (
        Ticket_ID, Customer_Email, Purchase_Date, Purchase_Time,
        Card_Num, Exp_Date, Name_On_Card, Card_Type, First_Name, Last_Name
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [ticket_id, customer_email, purchase_date, purchase_time, 
        cleanedCardNum, formattedExpDate, nameOnCard, cardType, nameOnCard.split(' ')[0], nameOnCard.split(' ')[1]], 
    (purchaseErr) => {
      if (purchaseErr) {
        console.error('Purchase error:', purchaseErr);
        return res.status(500).json({ error: 'Failed to process purchase' });
      }

      res.status(200).json({ 
        message: 'Ticket purchased successfully',
        ticket_id 
      });
    });
  });
});

customerRoute.delete('/cancel-ticket', async (req, res) => {
  const { ticketId } = req.body;
  const customerEmail = req.user?.email;

  // Input validation
  if (!ticketId || !customerEmail) {
    console.error('Missing required fields:', { ticketId, customerEmail });
    return res.status(400).json({ error: 'Ticket ID and user email are required' });
  }

  try {
    console.log('Starting cancellation for:', { ticketId, customerEmail });
    
    // 1. Verify purchase exists (simplified check)
    const [purchase] = await connection.query(
      `SELECT * FROM Purchase 
       WHERE Ticket_ID = ? AND Customer_Email = ?`,
      [ticketId, customerEmail]
    );

    console.log('Purchase verification results:', purchase);

    if (!purchase || purchase.length === 0) {
      console.error('Purchase verification failed. Checking database state...');
      const [purchaseCheck] = await connection.query(
        'SELECT * FROM Purchase WHERE Ticket_ID = ?', [ticketId]
      );
      console.error('Database state:', {
        purchaseRecord: purchaseCheck[0] || null,
        expectedEmail: customerEmail
      });
      return res.status(403).json({ 
        error: 'Ticket not found in your purchases',
        details: 'Verification failed despite ticket existing'
      });
    }

    // 2. Get flight information
    const [flightData] = await connection.query(
      `SELECT F.Depart_Date, F.Depart_Time
       FROM Flight F
       JOIN Ticket T ON F.Airline_Name = T.Airline_Name 
                     AND F.Flight_Num = T.Flight_Num
                     AND F.Depart_Date = T.Depart_Date
                     AND F.Depart_Time = T.Depart_Time
       WHERE T.Ticket_ID = ?`,
      [ticketId]
    );
    
    if (!flightData || flightData.length === 0) {
      console.error('Flight data not found for ticket:', ticketId);
      return res.status(404).json({ error: 'Flight information not found' });
    }
    
    const { Depart_Date, Depart_Time } = flightData[0];
    
    // 3. Perform cancellation
    const [deleteResult] = await connection.query(
      `DELETE FROM Purchase 
       WHERE Ticket_ID = ? AND Customer_Email = ?`,
      [ticketId, customerEmail]
    );

    if (deleteResult.affectedRows === 0) {
      console.error('No rows affected during deletion');
      return res.status(500).json({ error: 'No purchase record deleted' });
    }

    console.log('Successfully canceled ticket:', ticketId);
    return res.json({ 
      message: 'Ticket canceled successfully',
      ticketId: ticketId
    });

  } catch (err) {
    console.error('Cancellation process failed:', {
      error: err.message,
      stack: err.stack,
      sqlError: err.sqlMessage,
      ticketId: ticketId
    });
    return res.status(500).json({ 
      error: 'Failed to process cancellation',
      details: err.sqlMessage || err.message
    });
  }
});

customerRoute.post('/rate-flight', (req, res) => {
  const { airline_name, flight_num, depart_date, depart_time, rating, comment } = req.body;
  const customer_email = req.user?.email;

  if (!customer_email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const formattedDepartDate = new Date(depart_date).toISOString().split('T')[0];
  
  console.log('Checking purchase for:', {
    customer_email,
    airline_name, 
    flight_num,
    formattedDepartDate,
    depart_time
  });

  // First query to check eligibility
  connection.query(`
    SELECT 1
    FROM Purchase p
    JOIN Ticket t ON p.Ticket_ID = t.Ticket_ID
    JOIN Flight f ON t.Airline_Name = f.Airline_Name 
                 AND t.Flight_Num = f.Flight_Num
                 AND t.Depart_Date = f.Depart_Date
                 AND t.Depart_Time = f.Depart_Time
    WHERE p.Customer_Email = ?
      AND f.Airline_Name = ?
      AND f.Flight_Num = ?
      AND f.Depart_Date = ?
      AND f.Depart_Time = ?
      AND (
            (f.Arrival_Date < CURRENT_DATE) OR
            (f.Arrival_Date = CURRENT_DATE AND f.Arrival_Time < CURRENT_TIME)
          )
    LIMIT 1;
  `, [customer_email, airline_name, flight_num, formattedDepartDate, depart_time], 
  (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    console.log('Eligibility check results:', results);
    
    if (!results || !results.length) {
      return res.status(403).json({ error: 'You cannot rate a flight you haven\'t flown or bought.' });
    }

    // Second query to insert rating
    // In the rating submission query, change:
    connection.query(`
      INSERT INTO Ratings (
        Customer_Email, Airline_Name, Flight_Num,
        Depart_Date, Depart_Time, Comment, Rating
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        Comment = VALUES(Comment),
        Rating = VALUES(Rating);
    `, [customer_email, airline_name, flight_num, formattedDepartDate, depart_time, comment, rating], 
    (err) => {
      if (err) {
        console.error('Rating submission error:', err);
        return res.status(500).json({ error: 'Failed to submit rating' });
      }
      
      res.status(200).json({ message: 'Rating submitted successfully.' });
    });
  });
});

module.exports = customerRoute;