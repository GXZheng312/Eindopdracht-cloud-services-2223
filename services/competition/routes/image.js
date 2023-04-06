const express = require('express');
const amqp = require('amqplib');
const { publishImageRequest } = require('../publisher');
const router = express.Router();

router.get('/test', async (req, res, next) => {
    const response = await publishImageRequest("https://www.seo-snel.nl/google-afbeeldingen/google-afbeeldingen.png");
    res.json(response);
});

router.get('/:imageurl', async (req, res, next) => {
    const imageurl = req.params.imageurl;
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    const key = `test.${imageurl}`
    const replyKey = key + ".response"
    const exchangeName = "images"
    
    const correlationId = generateUuid();
    
    await channel.assertExchange(exchangeName, 'topic', {
        durable: false
    });

    const queueName = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(queueName.queue, exchangeName, replyKey);

    channel.consume(queueName.queue, message => {
        console.log('received a reply message from rabbitmq');
        console.log(message.content.toString())
        connection.close()
    })
 
    channel.publish(exchangeName, key, Buffer.from(JSON.stringify({ data: imageurl, correlationId: correlationId, replyTo: replyKey})), {
        contentType: 'application/json',
        persistent: true,
        replyTo: replyKey
    });

    res.send(imageurl);
});


function generateUuid() {
    return Math.random().toString() +
           Math.random().toString() +
           Math.random().toString();
  }

module.exports = router;
