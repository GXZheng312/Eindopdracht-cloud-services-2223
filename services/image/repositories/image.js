const Image = require('../models/image');

async function createImage(url, uploadby) {
  const image = new Image({
    url,
    uploadby,
  });
  await image.save();
  return image;
}
async function findImages(data) {
  console.log(data);
  const images = await Image.find(data);
  console.log("image: " + images);
  return images;
}
async function getImageByUrl(url) {
  const image = await Image.findOne({ url });
  return image;
}

async function getImageByUser(uploadby) {
  const image = await Image.findOne({ uploadby });
  return image;
}

async function updateImage(url, updates) {
  const image = await Image.findOneAndUpdate({ url }, {$set: updates}, { new: true });
  return image;
}

async function deleteImage(url) {
  const image = await Image.findOneAndDelete({ url });
  return image;
}

module.exports = {
  createImage,
  getImageByUrl,
  updateImage,
  deleteImage,
  getImageByUser,
  findImages
};