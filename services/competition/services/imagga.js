const axios = require('axios');
const fs = require('fs');

const createFaceId = async (url) => {
    const FormData = require('form-data');

    const apiKey = process.env.IMAGGA_API_KEY;
    const apiSecret = process.env.IMAGGA_API_SECRET;

    const filePath = url;
    const formData = new FormData();
    formData.append('image', fs.createReadStream(filePath));

    (async () => {
    try {
        const { default: got } = await import('got');
        const response = await got.post('https://api.imagga.com/v2/faces/detections', {body: formData, username: apiKey, password: apiSecret});
        const faceId = response.body.result.faces[0].face_id;
        return faceId;
    } catch (error) {
        console.log(error);
    }
    })();
}
const compareImages = async (targetImageUrl, imageUrl) => {
    const apiKey = process.env.IMAGGA_API_KEY;
    const apiSecret = process.env.IMAGGA_API_SECRET;

    const categorizer = "general_v3";
    const url = 'https://api.imagga.com/v2/images-similarity/categories/' + categorizer + '?image_url=' + encodeURIComponent(targetImageUrl) + '&image2_url='+encodeURIComponent(imageUrl);

    try {
        const { default: got } = await import('got');
        const response = await got(url, {username: apiKey, password: apiSecret});
        console.log(response.body);
        return JSON.parse(response.body).result.distance;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
  compareImages,
  createFaceId
}
