const amqp = require('amqplib');

const connect = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();

  return { connection, channel };
};

const publishToExchange = async (exchangeName, routingKey, data) => {
  const { channel, connection } = await connect();
  const responseQueue = await channel.assertQueue('', { exclusive: true });

  await channel.assertExchange(exchangeName, 'topic', { durable: false });
  await channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(data)), {
    replyTo: responseQueue.queue
  });

  setTimeout(() => {
    connection.close();
  }, 10000);

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
  publishToExchange,
  subscribeToTopic,
};