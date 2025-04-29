const express = require('express');
const customerRoute = express.Router();
const connection = require('../db/database.js');

// View all future flights for the customer
customerRoute.get('/view-my-flights', async (req, res) => {
});

customerRoute.get('/search-flights', (req, res) => {});

customerRoute.post('/purchase-ticket', (req, res) => {});

customerRoute.post('/cancel-ticket', (req, res) => {});

customerRoute.post('/rate-flight', (req, res) => {});