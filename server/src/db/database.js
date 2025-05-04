// db.js
const mysql = require('mysql');

const dbConfig = {
  user: 'root',
  password: 'root',
  database: 'airline_database',
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
};

let connection;

function handleDbConnection() {
  connection = mysql.createConnection(dbConfig);

  connection.connect(err => {
    if (err) {
      console.error('Error connecting to database:', err.code);
      setTimeout(handleDbConnection, 2000); // Retry after 2 seconds
    } else {
      console.log('Database connection established.');
    }
  });

  connection.on('error', err => {
    console.error('Database error:', err.code);
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
      console.log('Reconnecting to database...');
      handleDbConnection();
    } else {
      throw err;
    }
  });
}

// Start connection immediately
handleDbConnection();

// Export the connection to use elsewhere
module.exports = connection;