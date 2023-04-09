const { callRPC, publishToTopic } = require("../services/rabbitmq");

// queue imageurl
const publishImageDataRequest = async (imagename) => {
    const queueName = "imagedata_request"
    console.log(`sended a message for image data request. Queue name: ${queueName}`)

    const data = await callRPC(queueName, { imagename });
    return data;
};

const publishImageData = async (imageName, imageData, uploadby) => {
    const exchangeName = "image";
    const routingKey = "image.upload." + imageName;

    publishToTopic(exchangeName, routingKey, { imageName, imageData, uploadby });
    console.log(`sended a message for image upload. Routing key: ${routingKey}`)
};

module.exports = {
    publishImageDataRequest,
    publishImageData
}