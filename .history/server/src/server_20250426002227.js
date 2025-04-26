const express = require('express');
const mysql = require('mysql');

const app = express();
const PORT = 3000;

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'airport_system',
  port: '8889'
};

let connection;

// Function to handle (re)connection
function handleDbConnection() {
  connection = mysql.createConnection(dbConfig);
  connection.connect(err => {
    if (err) {
      console.error('Error connecting to database:', err.code);
    } else {
      console.log('Database connection ready.');
      app.listen(PORT, () => { console.log('Server is listening on port', PORT); });
    }
  });

  connection.on('error', err => {
    console.error('Database error:', err.code);
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET')
    console.log('Reconnecting to database...');
    else throw err;
  });
}

handleDbConnection();
