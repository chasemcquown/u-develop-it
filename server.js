// connect to the MySQL database
const mysql = require('mysql2');

const express = require('express');

const PORT = process.env.PORT || 3001;

const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

// query the database to test the connection. NOTE: in the following code, the db object is using the query() method. This method runs the SQL query and executes the callback with all the resulting rows that match the query . Once this method executes the SQL command, the callback function captures the responses from the query in two variables: the err, which is the error response, and rows, which is the database query response.
db.query(`SELECT * FROM candidates`, (err, rows) => {
    console.log(rows);
});

// add route to handle user requests that aren't supported by the app
// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});  

// adds the function that will start the Express.js server on port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});