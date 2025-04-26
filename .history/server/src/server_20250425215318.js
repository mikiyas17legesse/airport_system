const mysql = require('mysql2');
const express = require('express');

const app = express();
const PORT = 3000;
const connection = mysql.createConnection({
  user: 'root',
  password: 'root',
  database: 'airline_database',
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

app.get('/flights', (req, res) => {
    connection.query('SELECT * FROM flight', (err, results) => {
      if (err) {
        console.log("Here")
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.json(results);
    });
  });

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
