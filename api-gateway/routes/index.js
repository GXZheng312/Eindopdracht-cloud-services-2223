var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// add here all other routes
router.use('/login', require('./login'));
router.use('/target-image', require('./targetimage'));
router.use('/user-image', require('./targetimage'));
module.exports = router;
