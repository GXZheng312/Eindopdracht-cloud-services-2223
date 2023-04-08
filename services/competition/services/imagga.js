const axios = require('axios');
const fs = require('fs');

async function uploadImage(url) {
    const form = new FormData();
    const apiKey = process.env.IMAGGA_API_KEY;
    const apiSecret = process.env.IMAGGA_API_SECRET;

    const { default: got } = await import('got');
    const imageBuffer = await got(url).buffer();
    form.append(`image`, imageBuffer, { filename: 'image.jpg' });
    
    const response = await fetch('https://api.imagga.com/v2/uploads', {
        method: 'POST',
        body: form,
        headers: {
        'Authorization': `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`
        }
    });

    const json = await response.json();
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
