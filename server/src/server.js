const express = require('express');
const connection = require('./db/database'); 
const authRoute = require('./routes/authRoutes');
const customerRoute = require('./routes/customerRoutes');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/customer', customerRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


