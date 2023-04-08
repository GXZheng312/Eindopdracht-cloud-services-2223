const express = require('express');
const router = express.Router();
const authtokenRepository = require('../repositories/authtoken');
const { generateToken, decodeToken } = require('../services/auth');

router.post('/', async (req, res, next) => {
    try {
        const { username, rolename } = req.body;
        const authtoken = await generateToken(username, rolename);
        res.status(201).json(authtoken);
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const authtokens = await authtokenRepository.findAllAuthTokens();
        if (!authtokens) {
            res.status(404).json({ message: 'Auth token not found' });
        } else {
            res.status(200).json(authtokens);
        }
    } catch (err) {
        next(err);
    }
});

router.get('/:token', async (req, res, next) => {
    try {
        const { token } = req.params;
        const authtoken = await authtokenRepository.findAuthTokenByToken(token);
        const decodedToken = decodeToken(token);
        if (!authtoken) {
            res.status(404).json({ message: 'Auth token not found' });
        } else {
            res.status(200).json({ authtoken, decodedToken });
        }
    } catch (err) {
        next(err);
    }
});

router.delete('/:token', async (req, res, next) => {
    try {
        const { token } = req.params;
        const deletedAuthtoken = await authtokenRepository.deleteAuthToken(token);
        if (!deletedAuthtoken) {
            res.status(404).json({ message: 'Auth token not found' });
        } else {
            res.status(200).json(deletedAuthtoken);
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;
