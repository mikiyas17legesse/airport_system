const express = require('express');
const router = express.Router();
const connection = require('server/src/db/database.js');

router.get('./view_my_flights', (req, res) => {
    // will fill this up

    res.json({success: true, message: "Viewing My Flights: Hit endpoint"});
});