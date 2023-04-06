const express = require('express');
const amqp = require('amqplib');
const router = express.Router();

router.get('/:username', async (req, res, next) => {
    const username = req.params.username;
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    const exchangeName = "users"
    
    await channel.assertExchange(exchangeName, 'topic', {
        durable: false
    });

    channel.publish(exchangeName, "test.whatever", Buffer.from(username));

    res.send(username);
});

module.exports = router;
