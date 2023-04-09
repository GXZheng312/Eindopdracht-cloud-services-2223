const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticateToken, authenticateTokenRole } = require('../middleware/auth');

const root = "http://" + process.env.COMPETITION_SERVER;

// login/
router.post('/', authenticateToken, async (req, res, next) => {
  const USER_SERVER = root + "/user-image/";
  
  try {
    const response = await axios.post(USER_SERVER, req.body, {
        headers: {
          Authorization: req.headers.authorization
        }
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(error.response.status || 500).json({ error: error.message });
  }
});

module.exports = router;
