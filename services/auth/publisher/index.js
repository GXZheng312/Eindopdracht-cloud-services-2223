const myPublish = async () => {
    const exchangeName = 'user';
    const routingKey = 'user.auth.key';
    const message = { hello: 'world' };

    try {
        await publishToExchange(exchangeName, routingKey, message);
        console.log('Message published successfully');
    } catch (error) {
        console.error('Failed to publish message:', error);
    }
}

module.exports = { 
    myPublish
}