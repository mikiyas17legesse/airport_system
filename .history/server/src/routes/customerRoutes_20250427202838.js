const express = require('express');
const customerRoute = express.Router();
const connection = require('server/src/db/database.js');

// View my flights endpoint, either future or past
customerRoute.get('./view-my-flights', (req, res) => {
    const { email, timePeriod } = req.body;
});  

customerRoute.get('./search-flights', (req, res) => {});

customerRoute.post('./purchase-ticket', (req, res) => {});

customerRoute.post('./cancel-ticket', (req, res) => {});

customerRoute.post('./rate-flight', (req, res) => {});