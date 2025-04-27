const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 5001;

// ✅ Middlewares
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// ✅ MySQL Connection
const db = mysql.createConnection({
  user: 'root',
  password: 'root',
  database: 'airline_database',
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

// ✅ Test Route
app.get('/', (req, res) => {
  res.json({ message: 'Server is up and running! 🚀' });
});

app.post('/api/customer/signup', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO customer (email, password, first_name, last_name) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, firstName, lastName],
      (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.json({ success: false, message: 'Email already exists' });
          }
          return res.status(500).send(err);
        }

        res.json({ success: true, userId: result.insertId });
      }
    );
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Server error during signup' });
  }
});


// ✅ Customer Login
app.post('/api/customer/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  db.query(
    'SELECT * FROM customer WHERE email = ?',
    [email],
    async (err, users) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'Server error during login' });
      }

      if (users.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const user = users[0];

      try {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const { password: _, ...userWithoutPassword } = user;
        res.json({ success: true, message: 'Login successful', user: userWithoutPassword });

      } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error during login' });
      }
    }
  );
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ success: false, message: 'Something broke!', error: err.message });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
