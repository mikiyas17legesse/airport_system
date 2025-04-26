const express = require('express');
const mysql = require('mysql'); 

const app = express();
const PORT = 3000;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', 
  database: "ExpressIntegration",
  port: '8889'
});

// Open the MySQL connection
connection.connect(error => {
    if (error) {
        console.log("An error occurred while connecting to the database.");
        throw error;
    }

    console.log("Database connection is ready.");

    // If everything is correct, then start Express Server
    app.listen(PORT, () => {
        console.log("🚀 Server is listening on port", PORT);
    });
});
