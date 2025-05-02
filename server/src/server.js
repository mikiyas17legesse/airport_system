const express = require('express');
const connection = require('./db/database'); 
const authRoute = require('./routes/authRoutes');
const staffRoute = require('./routes/staffRoutes');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/staff', staffRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
