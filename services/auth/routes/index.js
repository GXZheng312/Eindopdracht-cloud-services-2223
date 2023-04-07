const express = require('express');
const { connection } = require('../services/rabbitmq');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("hello im from auth container")
  console.log(connection)
});

module.exports = router;
