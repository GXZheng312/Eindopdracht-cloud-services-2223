const UserInputImage = require('../models/userInputImage');

// Create a new user input image
const createUserInputImage = async (userInputImageData) => {
    const userInputImage = new UserInputImage(userInputImageData);
    userInputImage.save();
    return userInputImage;
};

// Get all user input images
const getAllUserInputImages = async () => {
    const userInputImages = await UserInputImage.find().populate("targetimage");
    return userInputImages;
};

// Get a user input image by ID
const getUserInputImageById = async (id) => {
    const userInputImage = await UserInputImage.findById(id);
    return userInputImage;
};

// Update a user input image by ID
const updateUserInputImageById = async (id, userInputImageData) => {
    const userInputImage = await UserInputImage.findById(id);
    Object.assign(userInputImage, userInputImageData);
    await userInputImage.save();
    return userInputImage;
};

// Delete a user input image by ID
const deleteUserInputImageById = async (id) => {
    const userInputImage = await UserInputImage.findById(id);
    await userInputImage.remove();
    return userInputImage;
};

module.exports = {
  createUserInputImage,
  getAllUserInputImages,
  getUserInputImageById,
  updateUserInputImageById,
  deleteUserInputImageById,
};