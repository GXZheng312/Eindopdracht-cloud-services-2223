const express = require('express');
const { publicImageDataRequest } = require('../publisher');
const router = express.Router();
const TargetImage = require('../models/targetImage');
const { compareImages, uploadImage } = require('../services/imagga');

router.get('/search', async (req, res) => {
  const { radius, placename } = req.query;
  const imageFilter = {};

  if (radius) {
    const regex = new RegExp(radius.replace(/\//g, ''), 'i');
    imageFilter.name = regex;
  }

  if (placename) {
    const regex = new RegExp(placename.replace(/\//g, ''), 'i');
    imageFilter.placename = regex;
  }

  if (radius && placename) {
    const radiusRegex = new RegExp(radius.replace(/\//g, ''), 'i');
    const placenameRegex = new RegExp(placename.replace(/\//g, ''), 'i');
    imageFilter.$or = [
      { radius: { $regex: `.*${radius}.*`, $options: 'i' }, placename: placenameRegex },
      { placename: { $regex: `.*${placename}.*`, $options: 'i' }, radius: radiusRegex },
      { radius: radiusRegex, placename: placenameRegex }
    ];
  }
  const images = await TargetImage.find(imageFilter);
  res.json({ images });
});

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

// Retrieve all target images
router.get('/', async function(req, res) {
    try {
        const targetImages = await TargetImage.find();
        res.status(200).json(targetImages);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: `Error retrieving target images`,
            error: err
        });
    }
});
router.get('/compare', async (req, res) => {
    const { targetImageUrl, imageUrl } = req.query
    try {
        const imaggaTargetImage = uploadImage(targetImageUrl);
        const imaggaImageUrl = uploadImage(imageUrl);
        const score = await compareImages(imaggaTargetImage, imaggaImageUrl);
        res.json({ score });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to compare images' })
    }
});

// Retrieve a specific target image by URL
router.get('/:url', async function(req, res) {
    try {
        const targetImage = await TargetImage.findById(req.params.url);
        if (targetImage) {
            res.status(200).json(targetImage);
        } else {
            res.status(404).json({ message: 'Target image not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: `Error retrieving target image`,
            error: err
        });
    }
});


module.exports = router; 
