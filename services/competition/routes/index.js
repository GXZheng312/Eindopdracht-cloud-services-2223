var express = require('express');
const { publishImageData } = require('../publisher');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  publishImageData();
  res.send("hello im from competition container")
});

module.exports = router;
