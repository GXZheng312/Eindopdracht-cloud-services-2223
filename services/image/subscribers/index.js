const amqp = require('amqplib');
const { getImageByUrl } = require('../repositories/image');
const { handleRPC } = require('../services/rabbitmq');

const useImage = async () => {
    const queueName = "imageurl_request";

    handleRPC(queueName, async (data) => {
        const imageData = await getImageByUrl(data);
        return imageData
    })
}

console.log("loading all images")
useImage();
console.log("loaded all images")