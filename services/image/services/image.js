const fs = require('fs');
const path = require('path');

const convertToBase64 = async (imageData) => {
  const imageBuffer = Buffer.from(imageData.split(',')[1], 'base64');
  return imageBuffer;
};

const uploadImage = async (rawImageData, imagename = null) => {
  if(!imagename) {
    imagename = Date.now().toString() + Math.floor(Math.random() * 1000).toString() + '.jpg';
  }
  
  const imageDirectory = path.join(__dirname, '../public/images/');
  
  if (!fs.existsSync(imageDirectory)) {
    fs.mkdirSync(imageDirectory);
  }
  
  const imagePath = path.join(imageDirectory, imagename);
  await fs.promises.writeFile(imagePath, rawImageData);
  
  return imagename;
}

const deleteLocalImage = async (imagename) => {
  const imageDirectory = path.join(__dirname, '../public/images/');
  const imagePath = path.join(imageDirectory, imagename);

  try {
    await fs.promises.unlink(imagePath);
    console.log(`Image '${imagename}' deleted successfully.`);
  } catch (err) {
    console.log(`Failed to delete image '${imagename}': ${err.message}`);
  }
}


const getImageData = async (imagename) => {
  const imageDirectory = path.join(__dirname, '../public/images/');
  const imagePath = path.join(imageDirectory, imagename);

  if (!fs.existsSync(imagePath)) {
    console.log(`Image '${imagename}' not found`);
  }

  const imageData = await fs.promises.readFile(imagePath);
  const base64ImageData = imageData.toString('base64');

  return base64ImageData;
}


module.exports = {
    uploadImage,
    convertToBase64,
    deleteLocalImage,
    getImageData
};