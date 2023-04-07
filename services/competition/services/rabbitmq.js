const amqp = require('amqplib');

const pattern = 'topic'

let connection;

const initConnection = async () => {
  try{
    const conn = await amqp.connect(process.env.RABBITMQ_URL);
    console.log("Connected to RabbitMQ");
    return conn;
  } catch (error) { 
    console.log("Failed to connect to RabbitMQ:", error);
  }
};

const getConnection = async () => {
  if (!connection) {
    connection = await initConnection();
  }
  return connection;
};
 
const publishToTopic = async (exchangeName, routingKey, data, QueueName = '') => {
  const channel = await (await getConnection()).createChannel();

  await channel.assertQueue(QueueName, { exclusive: true });
  await channel.assertExchange(exchangeName, pattern, { durable: false });
  await channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(data)), {
    contentType: 'application/json',
    persistent: true,
  });
};
  
const subscribeToTopic = async (exchangeName, routingKey, callback, QueueName = '') => {
  const channel = await (await getConnection()).createChannel();
  const responseQueue = await channel.assertQueue(QueueName, { exclusive: true });
  
  await channel.assertExchange(exchangeName, pattern, { durable: false });
  await channel.bindQueue(responseQueue.queue, exchangeName, routingKey);
  await channel.consume(responseQueue.queue, (message) => {
    callback(JSON.parse(message.content.toString()), message.properties);
    channel.ack(message);
  });
};


const callRPC = async (queueName, data) => {
  const channel = await (await getConnection()).createChannel();
  const { queue } = await channel.assertQueue('', { exclusive: true });
  const uuid = generateUuid()

 channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
    contentType: 'application/json',
    replyTo: queue,
    correlationId: uuid
  });

  const response = await new Promise((resolve) => {
    channel.consume(queue, msg => {
      if(msg.properties.correlationId == uuid){
        const response = JSON.parse(msg.content.toString());
        resolve(response);
      }
    }, {noAck: true})
  });
  
  channel.close();

  return response;
};

const handleRPC = async (queueName, process) => {
  const channel = await (await getConnection()).createChannel();

  await channel.assertQueue(queueName, {durable: true});
  channel.prefetch(1);

  channel.consume(queueName, async (msg) => {
    const data = await process(JSON.parse(msg.content.toString()))

    console.log(data);

    channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(data)), {
      contentType: 'application/json',
      correlationId: msg.properties.correlationId
    })

    channel.ack(msg);

  }, {noAck: false})
};

const generateUuid = () => {
  return Math.random().toString() + Math.random().toString() + Math.random().toString();
};

module.exports = {
  publishToTopic,
  subscribeToTopic,
  callRPC,
  handleRPC
};