const express = require('express');
const staffRoute = express.Router();
const connection = require('../../server/src/db/database.js'); // adjust path if needed

//Staff Use Cases 

// 1. View Future Flights
staffRoute.get('/view-flights', (req, res) => {

  const airlineName = req.query.airline_name;
  const query = ' SELECT * FROM Flight WHERE Airline_Name = ? AND Depart_Date >=CURDATE() ORDER BY Depart_Date ASC';
  connection.query(query, [airlineName], (err, results) => {
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
    flight_num,
    airline_name,
    airplane_id,
    departure_airport,
    arrival_airport,
    departure_time,
    arrival_time,
    price
  } = req.body;

  const query = `
    INSERT INTO Flight (flight_num, airline_name, airplane_id, departure_airport, arrival_airport, departure_time, arrival_time, price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [flight_num, airline_name, airplane_id, departure_airport, arrival_airport, departure_time, arrival_time, price];

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
    UPDATE Flight
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
  const { airline_name, airplane_id, num_of_seats, manufacturer, model } = req.body;

  const query = `
    INSERT INTO Airplane (airline_name, airplane_id, num_of_seats, manufacturer, model)
    VALUES (?, ?, ?, ?, ?)
  `;

  connection.query(query, [airline_name, airplane_id, num_of_seats, manufacturer, model], (err, result) => {
    if (err) {
      console.error('Error adding airplane:', err);
      return res.status(500).send('Server error.');
    }
    res.send('Airplane added successfully.');
  });
});

// Add New Airport
staffRoute.post('/add-airport', (req, res) => {
  const { airport_name, city, country, airport_code } = req.body;

  const query = `
    INSERT INTO Airport (airport_name, city, country, airport_code)
    VALUES (?, ?, ?, ?)
  `;

  connection.query(query, [airport_name, city, country, airport_code], (err, result) => {
    if (err) {
      console.error('Error adding airport:', err);
      return res.status(500).send('Server error.');
    }
    res.send('Airport added successfully.');
  });
});

//  6. View Flight Ratings
staffRoute.get('/view-flight-ratings', (req, res) => {
  const { flight_num, airline_name } = req.query;

  const query = `
    SELECT rating, comment
    FROM FlightReview
    WHERE flight_num = ? AND airline_name = ?
  `;

  connection.query(query, [flight_num, airline_name], (err, results) => {
    if (err) {
      console.error('Error fetching flight ratings:', err);
      return res.status(500).send('Server error.');
    }
    res.json(results);
  });
});

//  7. View Reports (Tickets Sold)
staffRoute.get('/view-reports', (req, res) => {
  const { airline_name, startDate, endDate } = req.query;

  const query = `
    SELECT COUNT(*) AS total_tickets_sold
    FROM Ticket
    WHERE airline_name = ? AND purchase_date BETWEEN ? AND ?
  `;

  connection.query(query, [airline_name, startDate, endDate], (err, result) => {
    if (err) {
      console.error('Error fetching report:', err);
      return res.status(500).send('Server error.');
    }
    res.json(result[0]);
  });
});

module.exports = staffRoute;
