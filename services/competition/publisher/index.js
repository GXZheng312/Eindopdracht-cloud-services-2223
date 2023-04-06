const { publishToExchange, subscribeToTopic } = require("../services/rabbitmq");

const publishImageRequest = async (imageurl) => {
    const exchangeName = 'images';
    const routingKey = `test.${imageurl}`;

    return new Promise((resolve) => {
        subscribeToTopic(exchangeName, routingKey, (data) => {
            resolve(data);
        });
        publishToExchange(exchangeName, routingKey, imageurl);
    });
}

module.exports = { 
    publishImageRequest
}