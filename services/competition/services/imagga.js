const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function uploadImage(imageData) {
    const apiKey = process.env.IMAGGA_API_KEY;
    const apiSecret = process.env.IMAGGA_API_SECRET;

    const formData  = new FormData();
    formData.append('image_base64', imageData);
    
    const response = await fetch('https://api.imagga.com/v2/uploads', {
        method: 'POST',
        body: formData,
        headers: {
        'Authorization': `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`
        }
    });

    //const response = await got.post('https://api.imagga.com/v2/uploads', {body: formData, username: apiKey, password: apiSecret});

    const json = await response.json();
    console.log(json);
    return json.result.upload_ids[0];
}

const compareImages = async (targetImageUrl, imageUrl) => {
    const apiKey = process.env.IMAGGA_API_KEY;
    const apiSecret = process.env.IMAGGA_API_SECRET;

    const categorizer = "general_v3";
    const url = 'https://api.imagga.com/v2/images-similarity/categories/' + categorizer + '?image_url=' + encodeURIComponent(targetImageUrl) + '&image2_url='+encodeURIComponent(imageUrl);

    try {
        const { default: got } = await import('got');
        const response = await got(url, {username: apiKey, password: apiSecret});
        return JSON.parse(response.body).result.distance;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
  compareImages,
  uploadImage
}
