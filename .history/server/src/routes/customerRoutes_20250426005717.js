// src/routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const connection = require('../db/database'); // import the DB connection

router.post('/signup', (req, res) => {
  const {
    email, password, firstName, lastName,
    buildingNum, street, aptName, city, state, zip,
    passportNum, passportExpiration, passportCountry,
    dateOfBirth, phoneNumber
  } = req.body;

  if (!email || !password || !firstName || !lastName || !buildingNum || !street || !city || !state || !zip || !passportNum || !passportExpiration || !passportCountry || !dateOfBirth || !phoneNumber) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }

  const customerInsertQuery = `
    INSERT INTO Customer (
      email, password, first_name, last_name,
      address_building_number, address_street_name, address_apartment_number,
      address_city, address_state, address_zip_code,
      passport_number, passport_expiration, passport_country, date_of_birth
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const phoneInsertQuery = `
    INSERT INTO CustomerPhone (email, phone_number)
    VALUES (?, ?)
  `;

  // Insert customer first
  connection.query(
    customerInsertQuery,
    [
      email, password, firstName, lastName,
      buildingNum, street, aptName || null,
      city, state, zip,
      passportNum, passportExpiration, passportCountry, dateOfBirth
    ],
    (err, customerResult) => {
      if (err) {
        console.error('Error inserting customer:', err);
        return res.status(500).json({ success: false, message: 'Database error.' });
      }

      // Then insert phone
      connection.query(
        phoneInsertQuery,
        [email, phoneNumber],
        (err, phoneResult) => {
          if (err) {
            console.error('Error inserting phone number:', err);
            return res.status(500).json({ success: false, message: 'Database error.' });
          }

          res.json({ success: true, message: 'Customer created successfully.' });
        }
      );
    }
  );
});

module.exports = router;
