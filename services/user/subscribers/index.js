const { subscribeToTopic } = require("../services/rabbitmq");

console.log("loading all subscribers")

subscribeToTopic('user', 'user.auth.#', (message) => {
    console.log(`Received message: ${JSON.stringify(message)}`);
});

