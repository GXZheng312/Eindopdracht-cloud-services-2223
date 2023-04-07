const express = require('express');
const { publicImageDataRequest } = require('../publisher');
const router = express.Router();
const TargetImage = require('../models/targetImage');

router.post('/', async function(req, res) {
    const { imageurl, placename, radius, description } = req.body;

    const imageData = await publicImageDataRequest(imageurl);
    if (imageData) {
        const targetImage = new TargetImage({
            imageurl: imageData.url,
            thumbsup: 0,
            placename,
            radius,
            description
          });
        targetImage.save()
            .then((targetImage) => {
                res.status(200).send(`Targetimage ${targetImage.imageurl} saved successfully`);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send(`Error saving targetimage ${err}`);
            });
    } else {
        res.status(404).json({ message: 'Image not found' });
    }
});
  
module.exports = router; 
