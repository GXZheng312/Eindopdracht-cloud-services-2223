const express = require('express');
const router = express.Router();
const imageRepository = require('../repositories/image');
const { convertToBase64, uploadImage, deleteLocalImage } = require('../services/image');
const { authenticateToken } = require('../middleware/auth');

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
    const image = await imageRepository.getImageByUrl(url, req.query.pageIndex, req.query.pageSize);
    if (image) {
      res.status(200).json(image);
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
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

// PUT /images/:imagename
router.put('/:imagename', authenticateToken, async (req, res) => {
  try {
    const oldImageName = req.params.imagename;
    const oldImage = await imageRepository.getImageByimagename(oldImageName);
    const imageData = req.body.imagedata;

    if(req.role != "admin" && req.user != oldImage.uploadby){
      return res.status(403).json({ message: 'current user not authorized' });
    }

    // Delete old image
    if (req.body.deleteOldImage) {
      await deleteLocalImage(oldImageName);
    }
    
    // Upload updated image
    if (imageData) {
      const rawImageData = imageData;
      const binaryData = await convertToBase64(rawImageData);
      const imagename = await uploadImage(binaryData, req.params.imagename);
      console.log(`Image '${imagename}' uploaded successfully.`);
    }

    // update in database
    //const image = await imageRepository.updateImage(oldImageName, updates);

    // if (!image) {
    //   return res.status(404).json({ message: 'Image not found' });
    // }

    res.json("updated");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE /images/:imagename
router.delete('/:imagename', authenticateToken, async (req, res) => {
  try {
    const targetImage = await imageRepository.getImageByimagename(req.params.imagename);

    if(req.role != "admin" && req.user != targetImage.uploadby){
      return res.status(403).json({ message: 'current user not authorized' });
    }

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