const express = require('express');
const router = express.Router();
const fs = require('fs');
const imageRepository = require('../repositories/image');
const path = require('path');
const { authenticateToken } = require('../middleware/auth');
const { uploadImage } = require('../services/image');

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

router.post('/', authenticateToken, async function(req, res, next) {
  const { url } = req.body;
  const uploadby = req.user;
  try {
    if (isBase64Image(url)) {
      const image = uploadImage(url, uploadby);
      res.status(201).json(image);
    } else {
      res.status(400).json({ message: 'Invalid image format' });
    }
  } catch (error) {
    next(error);
  }
});


module.exports = router;