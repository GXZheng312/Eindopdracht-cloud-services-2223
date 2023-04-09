const express = require('express');
const router = express.Router();

const userRepository = require('../repositories/user');
const roleRepository = require('../repositories/role');

router.post('/', async function(req, res, next) {
  const { rolename } = req.body;
  try {
    const role = await roleRepository.createRole(rolename);
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json('Role already exists ' + error);
  }
});

module.exports = router;