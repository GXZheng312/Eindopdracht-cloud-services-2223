const express = require('express');
const router = express.Router();
const targetImageRepository = require('../repositories/targetimage');
const { authenticateTokenRole, authenticateToken } = require('../middleware/auth');
const { createUniqueImageName } = require('../services/image');
const { publishImageData, publishImageDeletion, publishImageUpdate } = require('../publisher');

router.get('/', async (req, res) => {
  try{
    const response = await targetImageRepository.getAllTargetImages(req.query.pageIndex, req.query.pageSize);
    res.status(200).json(response);
  }
  catch(error){
    res.status(404).json('target images not found ' + error)
 }
});

router.get('/search', async (req, res) => {
  try{
    const response = await targetImageRepository.findTargetImages(req.query.placename, req.query.thumbsup, req.query.pageIndex, req.query.pageSize);
    res.status(200).json(response);
  }
  catch(error){
    res.status(404).json('images not found ' + error)
  }
});

// GET a single target image by id
router.get('/:id', async (req, res) => {
  try {
    const targetImage = await targetImageRepository.getTargetImageById(req.params.id);
    if (targetImage == null) {
      return res.status(404).json({ message: 'Cannot find target image' });
    }
    res.json(targetImage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE a new target image
router.post('/', authenticateTokenRole("admin"), async (req, res) => {
  const { placename, radius, description, imageData } = req.body;
  const imagename = createUniqueImageName();
  const username = req.user;
  try {
    publishImageData(imagename, imageData, username);

    const newTargetImage = await targetImageRepository.createTargetImage({radius, placename, imagename, radius, description});
    res.status(201).json(newTargetImage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE an existing target image by id
router.put('/:id', authenticateToken("admin"), async (req, res) => {
  try {
    const { imagedata } = req.body;
    const username = req.user;
    const updatedTargetImage = await targetImageRepository.updateTargetImage(req.params.id, req.body);

    publishImageUpdate(updatedTargetImage.imagename, imagedata, username)

    res.json(updatedTargetImage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a target image by id
router.delete('/:id', authenticateToken("admin"), async (req, res) => {
  try {
    const username = req.user;
    const targetImage = await targetImageRepository.deleteTargetImage(req.params.id);
    
    publishImageDeletion(targetImage.imagename, username);

    res.json({ message: 'Target image deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
