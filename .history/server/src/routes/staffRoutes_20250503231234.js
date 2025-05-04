const express = require('express');
const staffRoute = express.Router();
const connection = require('../db/database.js'); // adjust path if needed

//Staff Use Cases 
// 1. View Flights (Past, Current, Future, All)
staffRoute.get('/view-flights', (req, res) => {
    const {
      airline_name,
      source_airport,
      destination_airport,
      source_city,
      destination_city,
      timeframe 
    } = req.query;

    let query = `
      SELECT F.Flight_Num,
             F.Airline_Name,
             F.Departure_Airport,
             F.Arrival_Airport,
             F.Depart_Date,
             F.Depart_Time,
             F.Arrival_Date,
             F.Arrival_Time,
             F.Status,
             DA.City AS Departure_City,
             AA.City AS Arrival_City
      FROM Flight F
      JOIN Airport DA ON F.Departure_Airport = DA.Code
      JOIN Airport AA ON F.Arrival_Airport = AA.Code
      WHERE 1=1
    `;
    const params = [];

    if (airline_name) {
      query += ' AND F.Airline_Name = ?';
      params.push(airline_name);
    }
    if (source_airport) {
      query += ' AND F.Departure_Airport = ?';
      params.push(source_airport);
    }
    if (destination_airport) {
      query += ' AND F.Arrival_Airport = ?';
      params.push(destination_airport);
    }
    if (source_city) {
      query += ' AND DA.City = ?';
      params.push(source_city);
    }
    if (destination_city) {
      query += ' AND AA.City = ?';
      params.push(destination_city);
    }

    // Timeframe logic
    const today = new Date().toISOString().split('T')[0];
    if (timeframe === 'past') {
      query += ' AND F.Depart_Date < ?';
      params.push(today);
    } else if (timeframe === 'current') {
      query += ' AND F.Depart_Date = ?';
      params.push(today);
    } else if (timeframe === 'future') {
      query += ' AND F.Depart_Date > ?';
      params.push(today);
    }
    // If timeframe is 'all' or not specified, no date filter is applied

    query += ' ORDER BY F.Depart_Date ASC, F.Depart_Time ASC';

    connection.query(query, params, (err, results) => {
      if (err) {
        console.error('Error fetching flights:', err);
        return res.status(500).send('Server error.');
      }
      res.json(results);
    });
});



// Create New Flights 
staffRoute.post('/create-flight', (req, res) => {
  const {
    airline_name,
    flight_num,
    depart_date,
    depart_time,
    arrival_date,
    arrival_time,
    base_price,
    airplane_id,
    departure_airport,
    arrival_airport,
    status
  } = req.body;

  // Log the incoming request for debugging
  console.log('Received flight creation:', req.body);

  // Validate required fields
  if (!airline_name || !flight_num || !depart_date || !depart_time || !arrival_date || !arrival_time || !base_price || !airplane_id || !departure_airport || !arrival_airport || !status) {
    return res.status(400).json({ success: false, message: 'Missing required flight fields.' });
  }

  const query = `
    INSERT INTO Flight (Airline_Name, Flight_Num, Depart_Date, Depart_Time, Arrival_Date, Arrival_Time, Base_Price, Airplane_ID, Departure_Airport, Arrival_Airport, Status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    airline_name,
    flight_num,
    depart_date,
    depart_time,
    arrival_date,
    arrival_time,
    base_price,
    airplane_id,
    departure_airport,
    arrival_airport,
    status
  ];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error creating flight:', err);
      return res.status(500).json({ success: false, message: 'Server error.' });
    }
    res.json({ success: true, message: 'Flight created successfully.' });
  });
});


// . Change Flight Status
staffRoute.post('/change-flight-status', (req, res) => {
  const { flight_num, airline_name, status } = req.body;

  const query = `
    UPDATE flight
    SET status = ?
    WHERE flight_num = ? AND airline_name = ?
  `;

  connection.query(query, [status, flight_num, airline_name], (err, result) => {
    if (err) {
      console.error('Error updating flight status:', err);
      return res.status(500).send('Server error.');
    }
    res.send('Flight status updated successfully.');
  });
});

//. Add New Airplane
staffRoute.post('/add-airplane', (req, res) => {
  const { airline_name, airplane_id, num_of_seats, manufactures, model_num, manufacturing_date } = req.body;

  const query = `
    INSERT INTO Airplane (Airline_Name, ID, Num_Of_Seats, Manufactures, Model_Num, Manufacturing_Date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(query, [airline_name, airplane_id, num_of_seats, manufactures, model_num, manufacturing_date], (err, result) => {
    if (err) {
      console.error('Error adding airplane:', err);
      return res.status(500).send('Server error.');
    }
    res.send('Airplane added successfully.');
  });
});

// Add New Airport
staffRoute.post('/add-airport', (req, res) => {
  const { code, name, city, country, num_of_terminals, type } = req.body;

  const query = `
    INSERT INTO Airport (Code, Name, City, Country, Num_Of_Terminals, Type)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(query, [code, name, city, country, num_of_terminals, type], (err, result) => {
    if (err) {
      console.error('Error adding airport:', err);
      return res.status(500).send('Server error.');
    }
    res.send('Airport added successfully.');
  });
});


// View Flight Ratings
staffRoute.get('/view-flight-ratings', (req, res) => {
  const { airline_name, flight_num, depart_date, depart_time } = req.query;

  const avgQuery = `
    SELECT AVG(Rating) AS average_rating
    FROM ratings
    WHERE Airline_Name = ? AND Flight_Num = ? AND Depart_Date = ? AND Depart_Time = ?
  `;

  const reviewsQuery = `
    SELECT Comment, Rating
    FROM ratings
    WHERE Airline_Name = ? AND Flight_Num = ? AND Depart_Date = ? AND Depart_Time = ?
  `;

  connection.query(
    avgQuery,
    [airline_name, flight_num, depart_date, depart_time],
    (err, avgResults) => {
      if (err) {
        console.error('Error fetching average rating:', err);
        return res.status(500).json({ error: 'Server error.', details: err });
      }

      connection.query(
        reviewsQuery,
        [airline_name, flight_num, depart_date, depart_time],
        (err, reviewResults) => {
          if (err) {
            console.error('Error fetching reviews:', err);
            return res.status(500).json({ error: 'Server error.', details: err });
          }

          res.json({
            average_rating: avgResults.length ? avgResults[0].average_rating : null,
            reviews: reviewResults
          });
        }
      );
    }
  );
});


// View Report: Total Tickets Sold
staffRoute.get('/view-reports', (req, res) => {
  const { startDate, endDate } = req.query;

  const query = `
    SELECT 
      YEAR(Depart_Date) AS year,
      MONTH(Depart_Date) AS month,
      COUNT(*) AS tickets_sold
    FROM ticket
    WHERE Depart_Date BETWEEN ? AND ?
    GROUP BY year, month
    ORDER BY year, month
  `;

  connection.query(query, [startDate, endDate], (err, results) => {
    if (err) {
      console.error('Error fetching ticket reports:', err);
      return res.status(500).send('Server error.');
    }
    res.json(results);
  });
});


module.exports = staffRoute;