const express = require('express');
const router = express.Router();

const imageRepository = require('../repositories/image');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("hello im from image container")
});

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

router.post('/', async function(req, res, next) {
  const { url, uploadby } = req.body;
  try {
    const image = await imageRepository.createImage(url, uploadby);
    res.status(201).json(image);
  } catch (error) {
    next(error);
  }
});

// router.put('/:username', async function(req, res, next) {
//   const username = req.params.username;
//   const updates = req.body;
//   try {
//     const user = await userRepository.getUserByUsername(username);
//     if (!user) {
//       res.status(404).json({ message: 'User not found' });
//       return;
//     }
//     if (updates.roleName) {
//       const role = await roleRepository.getRoleByName(updates.roleName);
//       if (!role) {
//         res.status(400).json({ message: 'Invalid role name' });
//         return;
//       }
//       updates.role = role._id;
//       delete updates.roleName;
//     }
//     const updatedUser = await userRepository.updateUser(user._id, updates);
//     res.status(200).json(updatedUser);
//   } catch (error) {
//     next(error);
//   }
// });

// router.delete('/:url', async function(req, res, next) {
//   const url = req.params.url;
//   try {
//     const image = await imageRepository.getImageByUrl(url);
//     if (!image) {
//       res.status(404).json({ message: 'Image not found' });
//       return;
//     }
//     await imageRepository.deleteImage(image.url);
//     res.status(204).send();
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = router;