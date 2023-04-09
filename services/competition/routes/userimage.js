const express = require('express');
const router = express.Router();
const userInputImageRepository = require('../repositories/userinputimage');
const { authenticateToken } = require('../middleware/auth');
const { createUniqueImageName } = require('../services/image');
const { publishImageData, publishImageDataRequest, publishImageDeletion } = require('../publisher');
const { getTargetImageByImagename } = require('../repositories/targetimage');
const { uploadImage } = require('../services/imagga');

// GET all user input images
router.get('/', async (req, res) => {
  try {
    const userInputs = await userInputImageRepository.getAllUserInputImages();
    res.status(200).json(userInputs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const response = await userInputImageRepository.findUserImages(req.query.username, req.query.score, req.query.pageIndex, req.query.pageSize);
    res.status(200).json(response);
  }
  catch (error) {
    res.status(404).json('images not found ' + error)
  }
});

// GET a single user input image by ID
router.get('/:id', (req, res) => {
  try {
    userInputImageRepository.getUserInputImageById(req.params.id);
    res.status(200).json(res.userInputImage);
  } catch {
    res.status(500).json({ message: err.message });
  }
});

// POST a new user input image
router.post('/', authenticateToken, async (req, res) => {
  const { imageData, targetImagename } = req.body;
  const username = req.user;

  try {
    const targetimage = await getTargetImageByImagename(targetImagename);
    if (!targetimage) {
      res.status(500).json(`target image name: ${targetImagename} not valid`);
    }

    const targetImageData = await publishImageDataRequest(targetimage.imagename);
    //console.log(targetImageData)
    //const reponse = await uploadImage(targetImageData.imageData);

    const score = Math.floor(Math.random() * 101);

    const imagename = createUniqueImageName();
    publishImageData(imagename, imageData, username);
    const userinputimage = await userInputImageRepository.createUserInputImage({ username, score: score, imagename, targetimage })

    res.status(201).json(userinputimage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a user input image by ID
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const username = req.user;
    const deletedUserimage = await userInputImageRepository.deleteUserInputImageById(req.params.id);
    publishImageDeletion(deletedUserimage.imagename, username);

    res.status(200).json({ message: 'User input image deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
