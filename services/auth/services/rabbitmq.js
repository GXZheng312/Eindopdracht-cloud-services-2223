const amqp = require('amqplib');

const connect = async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  return { connection, channel };
};

const publishToExchange = async (exchangeName, routingKey, data) => {
  const { channel, connection } = await connect();

  await channel.assertExchange(exchangeName, 'topic', { durable: true });
  await channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(data)), { persistent: true });

  setTimeout(() => {
    connection.close();
  }, 500);
};

const subscribeToTopic = async (exchangeName, routingKey, callback) => {
  const { channel } = await connect();

  const { queue } = await channel.assertQueue('', { exclusive: true });
  await channel.bindQueue(queue, exchangeName, routingKey);

  await channel.consume(queue, (message) => {
    callback(JSON.parse(message.content.toString()));
    channel.ack(message);
  });
};

module.exports = {
  publishToExchange,
  subscribeToTopic,
};