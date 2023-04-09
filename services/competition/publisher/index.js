const { callRPC, publishToTopic } = require("../services/rabbitmq");

// queue imageurl
const publicImageDataRequest = async (url) => {
    const queueName = "imageurl_request"

    const data = await callRPC(queueName, url);  
    
    return data;
};

const publishImageData = async (imageName, imageData, uploadby) => {
    const exchangeName = "image";
    const routingKey = "image.upload." + imageName;

    publishToTopic(exchangeName, routingKey, { imageName, imageData, uploadby });
    console.log("sended a message for demo request.") 
};

module.exports = { 
    publicImageDataRequest,
    publishImageData
}