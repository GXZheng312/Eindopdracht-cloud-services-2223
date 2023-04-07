const { getUserByUsername } = require('../repositories/user');
const { handleRPC, subscribeToTopic, initMQ } = require('../services/rabbitmq');

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
        console.log("recieved a message for demo request: user.process.*")
        console.log(data)
        console.log(prop)
    })
}

const processDemo2Requests = async () => {
    const exchangeName = "user";
    const routingPattern = "user.#"

    subscribeToTopic(exchangeName, routingPattern, (data, prop) => {
        console.log("recieved a message for demo request: user.#")
        console.log(data)
        console.log(prop)
    })
}

const processDemo3Requests = async () => {
    const exchangeName = "user";
    const routingPattern = "user.not.*"

    subscribeToTopic(exchangeName, routingPattern, (data, prop) => {
        console.log("recieved a message for demo request: user.not.*")
        console.log(data)
        console.log(prop)
    })
}

const loadAll = async () => {
    console.log("loading all subscribers");
    await useUser();
    await processDemoRequests();
    await processDemo2Requests();
    await processDemo3Requests();
    console.log("loaded all subscribers")
}

loadAll();