var express = require('express');
const { publishToExchange } = require('../services/rabbitmq');
var router = express.Router();

/* GET users listing. */
router.get('/', async (req, res, next) => {
  const username = "admin";
  const exchangeName = 'user';
  const routingKey = `user.auth.get.${username}`;
  const data = { username };

  await publishToExchange(exchangeName, routingKey, data);
});

module.exports = router;
