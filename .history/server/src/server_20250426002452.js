const express = require('express');
const connection = require('./db'); // 👈 Import the DB connection

const app = express();
const PORT = 3000;

app.use(express.json());

// Example API route
app.get('/test-db', (req, res) => {
  connection.query('SELECT NOW() AS currentTime', (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'DB error', error: err });
    }
    res.json({ success: true, data: results[0] });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
