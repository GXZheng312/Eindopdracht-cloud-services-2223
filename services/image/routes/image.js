const express = require('express');
const router = express.Router();
const imageRepository = require('../repositories/image');
const { convertToBase64, uploadImage, deleteLocalImage } = require('../services/image');
const { authenticateToken } = require('../middleware/auth');

router.get('/search', async (req, res) => {
  const { name, uploadby } = req.query;
  const imageFilter = {};

  if (name) {
    const regex = new RegExp(name.replace(/\//g, ''), 'i');
    imageFilter.imagename = regex;
  }

  if (uploadby) {
    const regex = new RegExp(uploadby.replace(/\//g, ''), 'i');
    imageFilter.uploadby = regex;
  }

  if (name && uploadby) {
    const nameRegex = new RegExp(name.replace(/\//g, ''), 'i');
    const uploadbyRegex = new RegExp(uploadby.replace(/\//g, ''), 'i');
    imageFilter.$or = [
      { imagename: { $regex: `.*${name}.*`, $options: 'i' }, uploadby: uploadbyRegex },
      { uploadby: { $regex: `.*${uploadby}.*`, $options: 'i' }, imagename: nameRegex },
      { imagename: nameRegex, uploadby: uploadbyRegex }
    ];
  }
  const images = await imageRepository.findImages(imageFilter);
  res.json({ images });
});

router.get('/', async (req, res, next) => {
  try {
    const images = await imageRepository.getAllImages();
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting images');
  }
});

// GET /images/:imagename
router.get('/:imagename', async (req, res) => {
  try {
    const image = await imageRepository.getImageByUrl(req.params.imagename);
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

// PUT /images/:imagename
router.put('/:imagename', async (req, res) => {
  try {
    const updates = req.body;
    const image = await imageRepository.updateImage(req.params.imagename, updates);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Upload updated image
    if (req.body.newImageData) {
      const rawImageData = req.body.newImageData;
      const imagename = await uploadImage(rawImageData, req.params.imagename);
      console.log(`Image '${imagename}' uploaded successfully.`);
    }

    // Delete old image
    if (req.body.deleteOldImage) {
      await deleteLocalImage(req.params.imagename);
    }

    res.json(image);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE /images/:imagename
router.delete('/:imagename', async (req, res) => {
  try {
    const image = await imageRepository.deleteImage(req.params.imagename);
   
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    await deleteLocalImage(image.imagename);
    res.json(image);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;