const express = require('express');
const router = express.Router();

const userRepository = require('../repositories/user');
const roleRepository = require('../repositories/role');

// user/
router.get('/:username', async function(req, res, next) {
  const username = req.params.username;
  try {
    const user = await userRepository.getUserByUsername(username);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
});

router.post('/', async function(req, res, next) {
  const { username, password, roleName } = req.body;
  try {
    const role = await roleRepository.getRoleByName(roleName);
    if (!role) {
      res.status(400).json({ message: 'Invalid role name' });
      return;
    }
    const user = await userRepository.createUser(username, password, role._id);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.put('/:username', async function(req, res, next) {
  const username = req.params.username;
  const updates = req.body;
  try {
    const user = await userRepository.getUserByUsername(username);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    if (updates.roleName) {
      const role = await roleRepository.getRoleByName(updates.roleName);
      if (!role) {
        res.status(400).json({ message: 'Invalid role name' });
        return;
      }
      updates.role = role._id;
      delete updates.roleName;
    }
    const updatedUser = await userRepository.updateUser(user._id, updates);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

router.delete('/:username', async function(req, res, next) {
  const username = req.params.username;
  try {
    const user = await userRepository.getUserByUsername(username);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    await userRepository.deleteUser(user._id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;