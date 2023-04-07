const express = require('express');
const { publishUserDataRequest } = require('../publisher');
const router = express.Router();

router.get('/', async (req, res, next) => {
    const url = "https://www.seo-snel.nl/google-afbeeldingen/google-afbeeldingen.png"; 
   
    const imageData = await publishUserDataRequest(url);
    
    res.json(imageData);
});

module.exports = router; 
