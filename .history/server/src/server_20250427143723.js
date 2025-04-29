const express = require('express');
const connection = require('./db/database'); 
const authRoute = require('./routes/authRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api/auth', authRoute);

// // Tester route
// app.get('/api/test', (req, res) => {
//   connection.query('SELECT NOW() AS currentTime', (err, results) => {
//     if (err) {
//       console.error('Query error:', err);
//       return res.status(500).json({ success: false, message: 'Database error.' });
//     }
//     res.json({ success: true, data: results[0] });
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


