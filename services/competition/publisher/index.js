const { callRPC, publishToTopic } = require("../services/rabbitmq");

// queue imageurl
const publishImageDataRequest = async (imagename) => {
    const queueName = "imagedata_request"
    console.log(`sended a message for image data request. Queue name: ${queueName}`)

    const data = await callRPC(queueName, { imagename });
    return data;
};

const publishImageData = async (imageName, imageData, uploadby) => {
    const queueName = "image_queue"
    const exchangeName = "image";
    const routingKey = "image.upload." + imageName;

    publishToTopic(exchangeName, routingKey, queueName, { imageName, imageData, uploadby });
    console.log(`sended a message for image upload. Routing key: ${routingKey}`)
};

const publishImageDeletion = async (imageName, uploadby) => {
    const queueName = "image_queue"
    const exchangeName = "image";
    const routingKey = "image.delete." + imageName;

    publishToTopic(exchangeName, routingKey, queueName, { imageName, imageData, uploadby });
    console.log(`sended a message for image delete. Routing key: ${routingKey}`)
};


const publishImageUpdate = async (imageName, imageData, uploadby) => {
    const queueName = "image_queue"
    const exchangeName = "image";
    const routingKey = "image.update." + imageName;

    publishToTopic(exchangeName, routingKey, queueName, { imageName, imageData, uploadby });
    console.log(`sended a message for image update. Routing key: ${routingKey}`)
};

module.exports = {
    publishImageDataRequest,
    publishImageUpdate,
    publishImageDeletion,
    publishImageData
}