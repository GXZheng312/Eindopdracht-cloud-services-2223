const express = require('express');
const router = express.Router();
const fs = require('fs');
const imageRepository = require('../repositories/image');
const path = require('path');

router.get('/:url', async function(req, res, next) {
  const url = req.params.url;
  try {
    const image = await imageRepository.getImageByUrl(url);
    if (image) {
      res.status(200).json(image);
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    next(error);
  }
});

function isBase64Image(str) {
  return /^data:image\/(png|jpg|jpeg|gif);base64,/.test(str);
}

router.post('/', async function(req, res, next) {
  const { url, uploadby } = req.body;
  try {
    if (isBase64Image(url)) {
      const imagePath = path.join(__dirname, '../public/static', `${Date.now()}.png`);
      const imageBuffer = Buffer.from(url.split(',')[1], 'base64');
      fs.writeFileSync(imagePath, imageBuffer);
      const image = await imageRepository.createImage(imagePath, uploadby);
      res.status(201).json(image);
    } else {
      res.status(400).json({ message: 'Invalid image format' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;