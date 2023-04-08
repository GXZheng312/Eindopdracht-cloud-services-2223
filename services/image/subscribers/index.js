const amqp = require('amqplib');
const { getImageByUrl, createImage } = require('../repositories/image');
const { handleRPC } = require('../services/rabbitmq');
const { subscribeToTopic } = require('../services/rabbitmq');
const { uploadImage } = require('../services/image');

// const useImage = async () => {
//     const queueName = "imageurl_request";

//     handleRPC(queueName, async (data) => {
//         const imageData = await getImageByUrl(data);
//         return imageData
//     })
// }

const processImageTopic = () => {
    const exchangeName = "image";
    const routingPattern = "image.upload.*"
 
    subscribeToTopic(exchangeName, routingPattern, async (data, prop) => {
        const { imageName, imageData, uploadby } = data;
       
        await uploadImage(imageData, imageName);
        await createImage(imageName, uploadby);
    })
}

const loadAll = async () => {
    console.log("loading all subscribers");
    await processImageTopic();
    console.log("loaded all subscribers")
}

loadAll();

// console.log("loading all images")
// useImage();
// console.log("loaded all images")