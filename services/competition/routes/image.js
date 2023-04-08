const express = require('express');
const { publicImageDataRequest } = require('../publisher');
const router = express.Router();

router.get('/', async (req, res, next) => {
    const url = "google.com"; 
   
    const imageData = await publicImageDataRequest(url);
    
    res.json(imageData);
});
module.exports = router; 
