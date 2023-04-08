const express = require('express');
const router = express.Router();
const imageRepository = require('../repositories/image');
const { convertToBase64, uploadImage } = require('../services/image');
const { authenticateToken } = require('../middleware/auth');

// get /images/
router.get('/', async (req, res) => {
  try {
    const images = await getAllImages();
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting images');
  }
});

// GET /images/:url
router.get('/:url', async (req, res) => {
  try {
    const image = await imageRepository.getImageByUrl(req.params.url);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.json(image);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST /images/
router.post('/', authenticateToken, async (req, res) => {
  try {
    const imageData = req.body.imagedata;
    const uploadby = req.user;
    
    const binaryData = await convertToBase64(imageData);
    const newImageFilename = await uploadImage(binaryData);
    const image = await imageRepository.createImage(newImageFilename, uploadby);
    
    res.status(201).json(image);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading image' });
  }
});


// GET /images/user/:uploadby
router.get('/user/:uploadby', async (req, res) => {
  try {
    const image = await imageRepository.getImageByUser(req.params.uploadby);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.json(image);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// PUT /images/:url
router.put('/:url', async (req, res) => {
  try {
    const updates = req.body;
    const image = await imageRepository.updateImage(req.params.url, updates);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.json(image);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE /images/:url
router.delete('/:url', async (req, res) => {
  try {
    const image = await imageRepository.deleteImage(req.params.url);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.json(image);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;