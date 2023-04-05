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

async function getUserById(id) {
  const user = await User.findById(id).populate('role');
  return user;
}

async function updateUser(id, updates) {
  const user = await User.findByIdAndUpdate(id, updates, { new: true });
  return user;
}

async function deleteUser(id) {
  await User.findByIdAndDelete(id);
}

module.exports = {
  createUser,
  getUserById,
  updateUser,
  deleteUser
};