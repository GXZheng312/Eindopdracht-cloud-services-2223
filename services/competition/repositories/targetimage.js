const TargetImage = require('../models/targetImage');

async function getAllTargetImages(pageIndex, pageSize) {
  const targetImages = await TargetImage.find().byPage(parseInt(pageIndex), parseInt(pageSize));
  return targetImages;
}

async function findTargetImages(placename, thumbsup, pageIndex, pageSize) {
  const images = await TargetImage.find()
    .byPage(parseInt(pageIndex), parseInt(pageSize))
    .byPlaceName(placename)
    .byThumbsUp(thumbsup);

  return images;
}
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
  findTargetImages
};
