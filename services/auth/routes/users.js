var express = require('express');
const { myPublish } = require('../publisher');

var router = express.Router();

/* GET users listing. */
router.get('/', async (req, res, next) => {
    await myPublish();
    res.send("hello");
});

module.exports = router;
