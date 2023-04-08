const jwt = require('jsonwebtoken');
const { deleteAuthToken, findPreviousAuthToken, createAuthToken } = require('../repositories/authtoken');

const secretKey = process.env.JWT_SECRET;

const generateToken = async (username, rolename) => {
    await removeOldAuthToken(username);

    const token = jwt.sign({ user: username, role: rolename }, secretKey, { expiresIn: '12h' });

    const now = new Date();
    const expires = new Date(now.getTime() + 12 * 60 * 60 * 1000); // 12 hours.

    await createAuthToken(token, expires, username);

    return { token, expires };
}

const removeOldAuthToken = async (username) => {
    const authToken = await findPreviousAuthToken(username);
    if (authToken) {
      await deleteAuthToken(authToken.token);
      return true;
    }

    return false;
}

const decodeToken = (token) => {
    try {
        const decodedToken = jwt.verify(token, secretKey);
        return decodedToken;
    } catch (err) {
        return null;
    }
}

module.exports = {
    generateToken,
    removeOldAuthToken,
    decodeToken
};
