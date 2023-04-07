const amqp = require('amqplib');
const { getUserByUsername } = require('../repositories/user');
const { handleRPC, subscribeToTopic } = require('../services/rabbitmq');

const useUser = async () => {
    const queueName = "userdata_request";

    handleRPC(queueName, async (data) => {
        const userData = await getUserByUsername(data);
        return userData
    })
}

const processDemoRequests = async () => {
    const exchangeName = "user";
    const routingPattern = "user.process.*"

    subscribeToTopic(exchangeName, routingPattern, (data, prop) => {
        console.log("recieved a message for demo request.")
        console.log(data)
        console.log(prop)
    })
}

console.log("loading all subscribers")
useUser();
processDemoRequests();
console.log("loaded all subscribers")