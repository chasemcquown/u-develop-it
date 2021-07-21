// require connection.js file in order to use its functionality here in the server file
const db = require('./db/connection');

// connect to the MySQL database
const mysql = require('mysql2');

const express = require('express');

// require apiRoutes folder to use the functionality within it
// REMEBER: you don't have to specify index.js in the path (e.g., ./routes/apiRoutes/index.js). If the directory has an index.js file in it, Node.js will automatically look for it when requiring the directory
const apiRoutes = require('./routes/apiRoutes');

// inport the inputCheck method so we can use the function
const inputCheck = require('./utils/inputCheck');

const PORT = process.env.PORT || 3001;

const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// use the routes in apiRoutes. We are telling our app--the server.js file--to use what is in const apiRoutes = require('./routes/apiRoutes')
app.use('/api', apiRoutes);

// add route to handle user requests that aren't supported by the app
// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});  

// adds the function that will start the Express.js server on port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});