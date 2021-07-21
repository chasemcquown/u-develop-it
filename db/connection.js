// NOTE: we removed this code from the server.js file and placed it here, in its own file, to keep server.js organized

const mysql = require('mysql2');

// the folllowing code will add connect the application to the MySQL database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'PeanutButterRottweiler&22',
      database: 'election'
    },
    console.log('Connected to the election database.')
);

// beacuse this file is now it's own module, we must export it to use its functionality elsewhere
module.exports = db;