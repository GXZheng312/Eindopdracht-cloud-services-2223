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
    //const got = require('got');

    const apiKey = process.env.IMAGGA_API_KEY;
    const apiSecret = process.env.IMAGGA_API_SECRET;

    const faceId = targetImageUrl;
    const secondFaceId = imageUrl;

    const url = 'https://api.imagga.com/v2/faces/similarity?face_id=' + faceId + '&second_face_id=' + secondFaceId;

    (async () => {
        try {
            const { default: got } = await import('got');
            const response = await got(url, {username: apiKey, password: apiSecret});
            return response;
        } catch (error) {
            console.log(error);
        }
    })();

}

module.exports = {
  compareImages,
  createFaceId
}
