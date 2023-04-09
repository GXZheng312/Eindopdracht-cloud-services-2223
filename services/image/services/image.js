const path = require('path');
const fs = require('fs');
const imageRepository = require('../repositories/image');

const uploadImage = async (imageData, uploadby) =>{
    const filename = `${Date.now()}.png`;
    const imagePath = path.join(__dirname, '../public/static', filename);
    const imageBuffer = Buffer.from(imageData.split(',')[1], 'base64');
    fs.writeFileSync(imagePath, imageBuffer);
    const image = await imageRepository.createImage(filename, uploadby);
    return image;
}

module.exports = {
    uploadImage
};