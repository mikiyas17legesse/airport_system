const express = require('express');
const staffRoute = express.Router();
const connection = require('../db/database.js'); // adjust path if needed

//Staff Use Cases 

// 1. View Future Flights
staffRoute.get('/view-flights', (req, res) => {});

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
      return res.status(500).send('Server error.');
    }
    res.send('Flight created successfully.');
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

  const query = `
    SELECT 
      AVG(Rating) AS average_rating, 
      Comment, 
      Rating
    FROM ratings
    WHERE Airline_Name = ? AND Flight_Num = ? AND Depart_Date = ? AND Depart_Time = ?
  `;

  connection.query(
    query, 
    [airline_name, flight_num, depart_date, depart_time], 
    (err, results) => {
      if (err) {
        console.error('Error fetching flight ratings:', err);
        return res.status(500).send('Server error.');
      }

      res.json({
        average_rating: results.length ? results[0].average_rating : null,
        reviews: results
      });
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
