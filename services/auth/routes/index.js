const express = require('express');
const { connection } = require('../services/rabbitmq');
const { publishUserDataRequest, publishDemoRequest } = require('../publisher');
const router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
  const username = "admin"; 
   
  const userData = await publishUserDataRequest(username);
  
  res.json(userData);
});

router.get('/demo-topic', async (req, res, next) => {
  publishDemoRequest();
  res.send("demo");
});


module.exports = router;
