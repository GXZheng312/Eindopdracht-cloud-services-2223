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

const publishToExchange = async (exchangeName, routingKey, data, correlationId = null, replyKey = null) => {
  const { connection, channel } = await connect();

  const responseQueue = await channel.assertQueue('', { exclusive: true });
  await channel.assertExchange(exchangeName, 'topic', { durable: false })
  ;
  await channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(data)), {
    contentType: 'application/json',
    persistent: true,
    replyTo: replyKey ? replyKey : responseQueue.queue,
    correlationId: correlationId ? correlationId : generateUuid() 
  });

  return responseQueue; 
};

const subscribeToTopic = async (exchangeName, routingKey, callback) => {
  const { connection, channel } = await connect();
  const queueName = await channel.assertQueue('', { exclusive: true });
  
  await channel.assertExchange(exchangeName, 'topic', { durable: false });
  await channel.bindQueue(queueName.queue, exchangeName, routingKey);

  await channel.consume(queueName.queue, (message) => {
    const messageProperties = message.properties;
    callback(JSON.parse(message.content.toString()), messageProperties, connection);
    channel.ack(message);
  });

  return connection 
};

function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}

module.exports = {
  connect,
  publishToExchange,
  subscribeToTopic
};