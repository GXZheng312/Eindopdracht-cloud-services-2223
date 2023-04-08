const Authtoken = require('../models/authtoken');

const findAllAuthTokens = async () => {
    return await Authtoken.find().catch(err => {
        throw err
    });
}

const findPreviousAuthToken = async (username) => {
    return await Authtoken.findOne({ username: { $eq: username } })
        .then((authToken) => authToken)
        .catch((err) => console.log('Cannot find previous token in AuthToken dataset', err));
}

const createAuthToken = async (token, expiredata, username) => {
    const authtoken = new Authtoken({ token, expiredata, username });

    return await authtoken.save().catch(err => {
        throw err
    });

}

const findAuthTokenByToken = async (token) => {
    return await Authtoken.findOne({ token }).catch(err => {
        throw err;
    });
}

const deleteAuthToken = async (token) => {
    return await Authtoken.findOneAndDelete({ token }).catch(err => {
        throw err;
    });
}

module.exports = {
    createAuthToken,
    findPreviousAuthToken,
    findAuthTokenByToken,
    deleteAuthToken,
    findAllAuthTokens,
};