const amqp = require('amqplib');
const { subscribeToTopic, publishToExchange } = require('../services/rabbitmq');
const { getUserByUsername } = require('../repositories/user');

console.log("loading all subscribers")

const useUser = async () => {
    const exchangeName = "user";
    const routingKey = `user.data.request.*`;

    subscribeToTopic(exchangeName, routingKey, async (username, prop, conn)  => {
        const userData = await getUserByUsername(username);
        console.log(userData)
        console.log(prop)
        publishToExchange(exchangeName, prop.replyTo, userData, prop.correlationId);
        console.log("send data back")
    })
}

useUser();