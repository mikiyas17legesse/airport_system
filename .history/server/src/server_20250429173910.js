const express = require('express');
const connection = require('./db/database'); 
const authRoute = require('./routes/authRoutes');

const app = express();
const PORT = 4000;

app.use(express.json());
app.use('/api/auth', authRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


