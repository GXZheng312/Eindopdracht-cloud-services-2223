const fs = require('fs');
const path = require('path');

const convertToBase64 = async (imageData) => {
  const imageBuffer = Buffer.from(imageData.split(',')[1], 'base64');
  return imageBuffer;
};

const uploadImage = async (rawImageData) => {
  const uniqueFilename = Date.now().toString() + Math.floor(Math.random() * 1000).toString() + '.jpg';
  
  const imageDirectory = path.join(__dirname, '../public/images/');
  
  if (!fs.existsSync(imageDirectory)) {
    fs.mkdirSync(imageDirectory);
  }
  
  const imagePath = path.join(imageDirectory, uniqueFilename);
  await fs.promises.writeFile(imagePath, rawImageData);
  
  return uniqueFilename;
}

module.exports = {
    uploadImage,
    convertToBase64
};