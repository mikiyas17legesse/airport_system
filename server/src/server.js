const express = require('express');
const connection = require('./db/database'); 
const authRoute = require('./routes/authRoutes');
const staffRoute = require('./routes/staffRoutes');
const flightRoute = require('./routes/flightRoutes');

const app = express();

const PORT = 3000;

app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/staff', staffRoute);
app.use('/api', flightRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
