const express = require('express');
const router = express.Router();
const imageRepository = require('../repositories/image');
const { convertToBase64, uploadImage, deleteLocalImage } = require('../services/image');
const { authenticateToken } = require('../middleware/auth');
const { uploadImage } = require('../services/image');
const { query, validationResult } = require('express-validator');

router.get('/', async (req, res) => {
  try{
    const response = await imageRepository.getAllImages(req.query.pageIndex, req.query.pageSize);
    res.status(200).json(response);
  }
  catch(error){
    res.status(404).json('images not found ' + error)
 }
});

router.get('/search', async (req, res) => {
  try{
    const response = await imageRepository.findImages(req.query.imagename, req.query.uploadby, req.query.pageIndex, req.query.pageSize);
    res.status(200).json(response);
  }
  catch(error){
    res.status(404).json('images not found ' + error)
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