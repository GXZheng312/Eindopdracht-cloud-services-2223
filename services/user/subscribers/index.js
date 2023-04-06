const amqp = require('amqplib');

console.log("loading all subscribers")

const useUser = async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    const exchangeName = "users"

    await channel.assertExchange(exchangeName, 'topic', {
        durable: false
    });

    const queueName = await channel.assertQueue('', { exclusive: true });
    console.log(queueName)

    await channel.bindQueue(queueName.queue, exchangeName, "test.#");
    await channel.consume(queueName.queue, message => {
        console.log('recieved a message from rabbitmq');
        console.log(message.content.toString())
    })
}

useUser();