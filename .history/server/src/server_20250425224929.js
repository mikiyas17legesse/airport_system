const express = require('express');
const mysql = require('mysql'); 

const app = express();
const PORT = 3000;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', 
  database: "airport_system",
  port: '8889'
});

// Test DB connection
connection.connect(error => {
    if (error) {
        console.log("An error occurred while connecting to the database.");
        throw error;
    }
    console.log("Database connection is ready.");
    app.listen(PORT, () => {
        console.log("Server is listening on port", PORT);
    });
});
