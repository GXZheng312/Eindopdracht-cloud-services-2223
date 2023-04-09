const express = require('express');
const router = express.Router();
<<<<<<< Updated upstream
const targetImageRepository = require('../repositories/targetimage');
const { authenticateTokenRole } = require('../middleware/auth');
const { publishImageData } = require('../publisher');
const { createUniqueImageName } = require('../services/image');

// GET all target images
router.get('/', async (req, res) => {
  try {
    const targetImages = await targetImageRepository.getAllTargetImages();
    res.json(targetImages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})
=======
const TargetImage = require('../models/targetImage');
const { compareImages, uploadImage } = require('../services/imagga');
const targetImageRepository = require('../repository/targetImage');
>>>>>>> Stashed changes

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
router.put('/:id', async (req, res) => {
  try {
    const updatedTargetImage = await targetImageRepository.updateTargetImage(req.params.id, req.body);
    res.json(updatedTargetImage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a target image by id
router.delete('/:id', async (req, res) => {
  try {
    await targetImageRepository.deleteTargetImage(req.params.id);
    res.json({ message: 'Target image deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
