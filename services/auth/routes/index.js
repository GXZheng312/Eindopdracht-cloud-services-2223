const express = require('express');
const { connection } = require('../services/rabbitmq');
const { publishUserDataRequest } = require('../publisher');
const router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
  const username = "admin"; 
   
  const userData = await publishUserDataRequest(username);
  
  res.json(userData);
});

module.exports = router;
