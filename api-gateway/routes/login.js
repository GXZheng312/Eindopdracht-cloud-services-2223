const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticateToken, authenticateTokenRole } = require('../middleware/auth');

const root = "http://" + process.env.USER_SERVER;

// login/
router.post('/', async (req, res, next) => {
  const { username, password } = req.body;
  const USER_SERVER = root + "/login";
  
  try {
    const response = await axios.post(USER_SERVER, { username, password });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(error.response.status || 500).json({ error: error.message });
  }
});

// EXAMPLES OF USING AUTH MIDDLEWARE :D
// delete this, not rest at all
router.get('/validate-token', authenticateToken, async (req, res, next) => {
  res.json("validate token middleware demo")
});

//authenticateToken("admin") or other roles
router.get('/validate-token-role', authenticateTokenRole("admin"), async (req, res, next) => {
  res.json("validate token role middleware demo")
});
module.exports = router;
