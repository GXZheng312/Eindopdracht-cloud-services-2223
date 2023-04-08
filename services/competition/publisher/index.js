const { callRPC, publishToTopic } = require("../services/rabbitmq");

// queue imageurl
const publicImageDataRequest = async (url) => {
    const queueName = "imageurl_request"

    const data = await callRPC(queueName, url);  
    
    return data;
};

const publishImageData = async (data) => {
    const exchangeName = "image";
    const routingKey = "image.upload.data";

    publishToTopic(exchangeName, routingKey, data);
    console.log("sended a message for demo request.") 
};

module.exports = { 
    publicImageDataRequest,
    publishImageData
}