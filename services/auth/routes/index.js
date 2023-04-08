const express = require('express');
const { publishUserDataRequest, publishDemoRequest } = require('../publishers');
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
