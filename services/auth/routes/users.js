const express = require('express');
const amqp = require('amqplib');
const router = express.Router();

router.get('/:username', async (req, res, next) => {
    const username = req.params.username;
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    const key = `test.${username}`
    const replyKey = key + ".response"
    const exchangeName = "users"
    
    const correlationId = generateUuid();

    await channel.assertExchange(exchangeName, 'topic', {
        durable: false
    });

    // -> test.admin == test.*
    // -> test.admin.response
    const queueName = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(queueName.queue, exchangeName, replyKey);

    channel.consume(queueName.queue, message => {
        console.log('recieved a reply message from rabbitmq');
        console.log(message.content.toString())
        connection.close()
    })
 
    channel.publish(exchangeName, key, Buffer.from(JSON.stringify({ data: username, correlationId: correlationId, replyTo: replyKey})), {
        contentType: 'application/json',
        persistent: true,
        replyTo: replyKey
    });

    res.send(username);
});


function generateUuid() {
    return Math.random().toString() +
           Math.random().toString() +
           Math.random().toString();
  }

module.exports = router;
