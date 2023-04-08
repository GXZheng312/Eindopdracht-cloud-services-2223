var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
const { getUserByUsernameAndPassword } = require('../repositories/user');
const { authtokenRequest } = require('../publishers');

const validateLoginFields = [
    body('username').notEmpty().withMessage('Username is required.').isLength({ min: 4 }).withMessage('Username must be at least 4 characters long.'),
    body('password').notEmpty().withMessage('Password is required.').isLength({ min: 4 }).withMessage('Password must be at least 4 characters long.')
];

// login/
router.post('/', validateLoginFields, async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required.' });
      return;
    }

    const user = await getUserByUsernameAndPassword(username, password);

    if (user) {
      console.log(user);
      const token = await authtokenRequest(user.username, user.role.rolename);

      if(!token) {
        res.status(200).json({ message: 'Login successful, auth server down.'});
      }

      res.status(200).json({ message: 'Login successful.', token: token});
    } else {
        res.status(401).json({ message: 'Invalid username or password.' });
    }
  });

module.exports = router;
