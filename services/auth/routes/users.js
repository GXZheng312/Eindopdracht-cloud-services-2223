const express = require('express');
const { publishUserDataRequest } = require('../publisher');
const router = express.Router();

router.get('/', async (req, res, next) => {
    const username = "admin"; 
   
    const userData = await publishUserDataRequest(username);
    
    res.json(userData);
});

module.exports = router; 
