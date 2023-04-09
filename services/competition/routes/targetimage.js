const express = require('express');
const router = express.Router();
const targetImageRepository = require('../repositories/targetimage');

// GET all target images
router.get('/', async (req, res) => {
  try {
    const targetImages = await targetImageRepository.getAllTargetImages();
    res.json(targetImages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

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
router.post('/', async (req, res) => {
  const targetImage = req.body;
  try {
    const newTargetImage = await targetImageRepository.createTargetImage(targetImage);
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
