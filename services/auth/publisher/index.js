const { publishToExchange, subscribeToTopic } = require("../services/rabbitmq");

const publishUserDataRequest = async (username) => {
    const exchangeName = 'user';
    const routingKey = `user.data.request.${username}`;
    const replyKey = `user.data.response.${username}`;
  
    return new Promise(async (resolve, reject) => { 
        await subscribeToTopic('user', replyKey, (data) => {
            console.log(data);
            resolve(data);
        });

        await publishToExchange(exchangeName, routingKey, username, null, replyKey);
    });
};

module.exports = { 
    publishUserDataRequest
}