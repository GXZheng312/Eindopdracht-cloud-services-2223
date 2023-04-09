const convertToBase64 = async (imageData) => {
  const imageBuffer = Buffer.from(imageData.split(',')[1], 'base64');
  return imageBuffer;
};

const createUniqueImageName = () => {
    return Date.now().toString() + Math.floor(Math.random() * 1000).toString() + '.jpg';
}

module.exports = {
    convertToBase64,
    createUniqueImageName
};