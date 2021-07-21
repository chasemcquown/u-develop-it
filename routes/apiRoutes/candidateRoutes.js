// NOTE: we moved this code from server.js into its own file in order to keep server.js organized
// NOTE: we also changed the "app" prefix to router after we moved this code into it's own file. Also, the route URLs don't need to include '/api' anymore because that prefix is defined in server.js.

// require express
const express = require('express');

// require router
const router = express.Router();

// require connection.js
const db = require('../../db/connection');

// require the inputCheck.js file to validate info 
const inputCheck = require('../../utils/inputCheck');

// query the database to test the connection. NOTE: in the following code, the db object is using the query() method. This method runs the SQL query and executes the callback with all the resulting rows that match the query . Once this method executes the SQL command, the callback function captures the responses from the query in two variables: the err, which is the error response, and rows, which is the database query response.
// GET all candidates, wrap in an Express.js route
router.get('/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name 
                 AS party_name 
                 FROM candidates 
                 LEFT JOIN parties 
                 ON candidates.party_id = parties.id`;
  
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
router.get('/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name 
                 AS party_name 
                 FROM candidates 
                 LEFT JOIN parties 
                 ON candidates.party_id = parties.id 
                 WHERE candidates.id = ?`;
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
router.delete('/candidate/:id', (req, res) => {
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
router.post('/candidate', ({ body }, res) => {
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

// add the ability to update a candidate's party using PUT request
router.put('/candidate/:id', (req, res) => {

    const errors = inputCheck(req.body, 'party_id');
  
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    } 
  
    const sql = `UPDATE candidates SET party_id = ? 
                 WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        // check if a record was found
      } else if (!result.affectedRows) {
        res.json({
          message: 'Candidate not found'
        });
      } else {
        res.json({
          message: 'success',
          data: req.body,
          changes: result.affectedRows
        });
      }
    });
});

// export the router object to use its functionality elsewhere
module.exports = router;

/* ADDITIONAL NOTES FROM MODULE LESSON 4:

// originally app.get('/api/candidates')
router.get('/candidates', (req, res) => {
  // internal logic remains the same
});

// originally app.get('/api/candidate/:id')
router.get('/candidate/:id', (req, res) => {});

// originally app.post('/api/candidate')
router.post('/candidate', ({ body }, res) => {});

// originally app.put('/api/candidate/:id')
router.put('/candidate/:id', (req, res) => {});

// originally app.delete('/api/candidate/:id')
router.delete('/candidate/:id', (req, res) => {});
*/
