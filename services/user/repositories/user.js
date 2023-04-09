const User = require('../models/user');

const createUser = async (username, password, roleId) => {
  const user = new User({
    username,
    password,
    address,
    role: roleId
  });
  await user.save();
  return user;
};

const getUserByUsernameAndPassword = async (username, password) => {
  const user = await User.findOne({ username, password }).populate('role'); 
  return user;
};

const updateUser = async (username, updates) => {
  const user = await User.findOneAndUpdate({ username }, updates, { new: true });
  return user;
};

const deleteUser = async (username) => {
  const user = await User.findOneAndDelete({ username });
  return user;
};

module.exports = {
  createUser,
  getUserByUsernameAndPassword,
  updateUser,
  deleteUser
};