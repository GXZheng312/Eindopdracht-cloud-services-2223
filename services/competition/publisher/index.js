const { callRPC } = require("../services/rabbitmq");

// queue imageurl
const publicImageDataRequest = async (url) => {
    const queueName = "imageurl_request"

    const data = await callRPC(queueName, url);  
    
    return data;
};

module.exports = { 
    publicImageDataRequest
}