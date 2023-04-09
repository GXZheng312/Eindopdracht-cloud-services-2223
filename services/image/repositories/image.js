const Image = require('../models/image');

async function createImage(imagename, uploadby) {
  const image = new Image({
    imagename,
    uploadby,
  });
  await image.save();
  return image;
}
<<<<<<< Updated upstream

async function getImageByimagename(imagename) {
  const image = await Image.findOne({ imagename });
=======
async function findImages(imagename, uploadby, pageIndex, pageSize) {
  const query = {};
  if (imagename) {
    query.imagename = imagename;
  }
  if (uploadby) {
    query.uploadby = uploadby;
  }
  const images = await Image.find(query).byPage(parseInt(pageIndex), parseInt(pageSize));;
  return images;
}

async function getAllImages(pageIndex, pageSize) {
  const images = await Image.find().byPage(parseInt(pageIndex), parseInt(pageSize));
  return images;
}

async function getImageByUrl(url, pageIndex, pageSize) {
  const image = await Image.findOne({ url }).byPage(parseInt(pageIndex), parseInt(pageSize));
>>>>>>> Stashed changes
  return image;
}

async function getImageByUser(uploadby) {
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

async function getAllImages() {
  const images = await Image.find();
  return images;
}


module.exports = {
  createImage,
  getImageByimagename,
  updateImage,
  deleteImage,
  getImageByUser,
<<<<<<< Updated upstream
=======
  findImages,
>>>>>>> Stashed changes
  getAllImages
};