const { publishToExchange, subscribeToTopic } = require("../services/rabbitmq");

const publishUserDataRequest = async (username) => {
    const exchangeName = 'user';
    const routingKey = `user.data.request.${username}`;

    await publishToExchange(exchangeName, routingKey, username);
    return new Promise((resolve) => {
        subscribeToTopic('user', `user.data.response.${username}`, (data) => {
            console.log(data);
            resolve(data);
        });
    });
}

module.exports = { 
    publishUserDataRequest
}