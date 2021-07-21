// NOTE: this index.js file will act as a central hub to pull all the routes together

// require express
const express = require('express');

// require router
const router = express.Router();

router.use(require('./candidateRoutes'));

router.use(require('./partyRoutes'));

// export router's functionality so it can be used elsewhere
module.exports = router;