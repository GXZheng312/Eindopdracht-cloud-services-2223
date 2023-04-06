const { publishToExchange, subscribeToTopic } = require("../services/rabbitmq");

const publishTargetImageRequest = async (targetimageurl) => {
    const exchangeName = 'targetimage';
    const routingKey = `targetimage.data.request.${targetimageurl}`;

    await publishToExchange(exchangeName, routingKey, targetimageurl);
    return new Promise((resolve) => {
        subscribeToTopic('targetimage', `targetimage.data.response.${targetimageurl}`, (data) => {
            console.log(data);
            resolve(data);
        });
    });
}

module.exports = { 
    publishTargetImageRequest
}