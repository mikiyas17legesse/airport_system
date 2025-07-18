const express = require('express');
const customerRoute = express.Router();
const connection = require('server/src/db/database.js');

customerRoute.get('./view-my-flights', (req, res) => {});

customerRoute.get('./search-flights', (req, res) => {});

customerRoute.post('./purchase-ticket', (req, res) => {});

customerRoute.post('./cancel-ticket', (req, res) => {});

customerRoute.post('./rate-flight', (req, res) => {});