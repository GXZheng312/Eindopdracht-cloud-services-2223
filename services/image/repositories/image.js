const Image = require('../models/image');

async function createImage(imagename, uploadby) {
  const image = new Image({
    imagename,
    uploadby,
  });
  await image.save();
  return image;
}

async function getImageByimagename(imagename) {
  const image = await Image.findOne({ imagename });
  return image;
}

async function findImages(imagename, uploadby, pageIndex, pageSize) {
  const images = await Image.find()
    .byPage(parseInt(pageIndex), parseInt(pageSize))
    .byImageName(imagename)
    .byUpload(uploadby);

  return images;
}
async function getAllImages(pageIndex, pageSize) {
  const images = await Image.find().byPage(parseInt(pageIndex), parseInt(pageSize));
  return images;
}

async function getImagesByUser(uploadby) {
  const images = await Image.find({ uploadby });
  return images;
}

async function updateImage(imagename, updates) {
  const image = await Image.findOneAndUpdate({ imagename }, {$set: updates}, { new: true });
  return image;
}

async function deleteImage(imagename) {
  const image = await Image.findOneAndDelete({ imagename });
  return image;
}

module.exports = {
  createImage,
  updateImage,
  deleteImage,
  getImagesByUser,
  findImages,
  getAllImages,
  getImageByimagename
};