const express = require('express');
const customerRoute = express.Router();
const connection = require('../db/database.js');

// View all future flights for the customer
customerRoute.get('/view-my-flights', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const query = `SELECT 
      f.Airline_Name, f.Flight_Num, f.Depart_Date, f.Depart_Time,
      f.Arrival_Date, f.Arrival_Time, f.Departure_Airport, f.Arrival_Airport,
      f.Status, f.Base_Price, t.Sold_Price, t.Ticket_ID
    FROM Purchase p 
    JOIN Ticket t ON p.Ticket_ID = t.Ticket_ID 
    JOIN Flight f ON t.Airline_Name = f.Airline_Name 
      AND t.Flight_Num = f.Flight_Num 
      AND t.Depart_Date = f.Depart_Date 
      AND t.Depart_Time = f.Depart_Time
    WHERE p.Customer_Email = ?
      AND TIMESTAMP(f.Depart_Date, f.Depart_Time) > NOW()
    ORDER BY f.Depart_Date, f.Depart_Time`;

    const [flights] = await connection.promise().query(query, [email]);
    res.json(flights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

customerRoute.get('./search-flights', (req, res) => {});

customerRoute.post('./purchase-ticket', (req, res) => {});

customerRoute.post('./cancel-ticket', (req, res) => {});

customerRoute.post('./rate-flight', (req, res) => {});