const amqp = require('amqplib');

const connect = async () => {
  try{
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    
    return { connection, channel };
  } catch (error) {
    console.log("Failed to connect to RabbitMQ:", error);
  }
};

const publishToExchange = async (exchangeName, routingKey, data) => {
  const { channel, connection } = await connect();
  const responseQueue = await channel.assertQueue('', { exclusive: true });

  await channel.assertExchange(exchangeName, 'topic', { durable: false });
  await channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(data)), {
    contentType: 'application/json',
    persistent: true,
    replyTo: "test"
  });

  return responseQueue;
};

const subscribeToTopic = async (exchangeName, routingKey, callback) => {
  const { channel } = await connect();
  const queueName = await channel.assertQueue('', { exclusive: true });
  
  await channel.assertExchange(exchangeName, 'topic', { durable: false });
  await channel.bindQueue(queueName.queue, exchangeName, routingKey);

  await channel.consume(queueName.queue, (message) => {
    const responseQueue = message.properties.replyTo;
    callback(JSON.parse(message.content.toString()), responseQueue);
    channel.ack(message);
  });
};

module.exports = {
  connect,
  publishToExchange,
  subscribeToTopic
};