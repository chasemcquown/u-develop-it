// connect to the MySQL database
const mysql = require('mysql2');

const express = require('express');

// inport the inputCheck method so we can use the function
const inputCheck = require('./utils/inputCheck');

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
// GET all candidates, wrap in an Express.js route
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;
  
    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: rows
      });
    });
});

// retrieve a candidate based on their unique ID #
// GET a single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    const params = [req.params.id];
  
    db.query(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: row
      });
    });
});

// add the ability to delete a candidate
// Delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
  
    db.query(sql, params, (err, result) => {
      if (err) {
        res.statusMessage(400).json({ error: res.message });
      } else if (!result.affectedRows) {
        res.json({
          message: 'Candidate not found'
        });
      } else {
        res.json({
          message: 'deleted',
          changes: result.affectedRows,
          id: req.params.id
        });
      }
    });
});

// add the ability to creat a candidate
// Create a candidate
// NOTE: notice that we're using object destructuring to pull the body property out of the request object, rather than it being req.body
app.post('/api/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
    // NOTE:  there is no column for the id. MySQL will autogenerate the id 
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
    VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err) {
         res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
         });
    });
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