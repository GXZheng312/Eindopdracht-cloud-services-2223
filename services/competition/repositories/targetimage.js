const TargetImage = require('../models/targetImage');

const getAllTargetImages = async () => {
  return TargetImage.find({});
};

const getTargetImageByImagename = async (imagename) => {
  return TargetImage.findOne({ imagename: imagename});
};

const createTargetImage = async (targetImageData) => {
  const newTargetImage = new TargetImage(targetImageData);
  return newTargetImage.save();
};

const updateTargetImage = async (id, targetImageData) => {
  return TargetImage.findByIdAndUpdate(id, targetImageData, { new: true });
};

const deleteTargetImage = async (id) => {
  return TargetImage.findByIdAndDelete(id);
};

module.exports = {
  getAllTargetImages,
  getTargetImageByImagename,
  createTargetImage,
  updateTargetImage,
  deleteTargetImage,
};
