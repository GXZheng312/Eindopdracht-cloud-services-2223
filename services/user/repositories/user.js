const User = require('../models/user');

async function createUser(username, password, roleId) {
  const user = new User({
    username,
    password,
    role: roleId
  });
  await user.save();
  return user;
}

async function getUserByUsername(username) {
  const user = await User.findOne({ username });
  return user;
}

async function updateUser(username, updates) {
  const user = await User.findOneAndUpdate({ username }, updates, { new: true });
  return user;
}

async function deleteUser(username) {
  const user = await User.findOneAndDelete({ username });
  return user;
}

module.exports = {
  createUser,
  getUserByUsername,
  updateUser,
  deleteUser
};