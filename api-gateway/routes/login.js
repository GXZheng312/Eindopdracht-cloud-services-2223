const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticateToken, authenticateTokenRole } = require('../middleware/auth');

const root = "http://" + process.env.USER_SERVER;

// login/
router.post('/', async (req, res, next) => {
  const { username, password } = req.body;
  const url = root + "/login";
  
  try {
    const response = await axios.post(url, { username, password });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(error.response.status || 500).json({ error: error.message });
  }
});

module.exports = router;
