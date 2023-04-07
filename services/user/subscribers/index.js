const amqp = require('amqplib');
const { getUserByUsername } = require('../repositories/user');
const { handleRPC } = require('../services/rabbitmq');

const useUser = async () => {
    const queueName = "userdata_request";

    handleRPC(queueName, async (data) => {
        const userData = await getUserByUsername(data);
        return userData
    })
}

console.log("loading all subscribers")
useUser();
console.log("loaded all subscribers")