const amqp = require('amqplib');

const pattern = 'topic'

let connection;
let channel;

const initMQ = async (callback) => {
  try {
    connection = await new Promise((resolve, reject) => {
      amqp.connect(process.env.RABBITMQ_URL)
        .then(conn => {
          console.log("Connected to RabbitMQ");
          resolve(conn);
        })
        .catch(error => {
          console.log("Failed to connect to RabbitMQ:", error);
          reject(error);
        });
    });

    channel = await new Promise((resolve, reject) => {
      connection.createChannel()
        .then(ch => {
          console.log("Channel Created");
          resolve(ch);
        })
        .catch(error => {
          console.log("Failed to create channel:", error);
          reject(error);
        });
    })

    callback()
  } catch {
    console.log("cant connect")
  }
};

const getChannel = async () => {
  /*if (!connection || !channel) {
    await initMQ();
  }*/

  if(!channel) {
    throw("Channel not created")
  }

  return channel;
};

const publishToTopic = async (exchangeName, routingKey, data, QueueName = '') => {
  const channel = await getChannel();

  await channel.assertQueue(QueueName, { exclusive: true });
  await channel.assertExchange(exchangeName, pattern, { durable: false });
  await channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(data)), {
    contentType: 'application/json',
    persistent: true,
  });
};

const subscribeToTopic = async (exchangeName, routingPattern, callback, QueueName = '') => {
  const channel = await getChannel();
  const responseQueue = await channel.assertQueue(QueueName, { exclusive: true });

  await channel.assertExchange(exchangeName, pattern, { durable: false });
  await channel.bindQueue(responseQueue.queue, exchangeName, routingPattern);
  await channel.consume(responseQueue.queue, (message) => {
    callback(JSON.parse(message.content.toString()), message.properties);
    channel.ack(message);
  });
};

const callRPC = async (queueName, data) => {
  try {
    const channel = await getChannel();
    const { queue } = await channel.assertQueue('', { exclusive: true });
    const uuid = generateUuid()

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
      contentType: 'application/json',
      replyTo: queue,
      correlationId: uuid
    });

    const response = await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject("Unable to get response back")
      }, 5000);

      channel.consume(queue, msg => {
        if (msg.properties.correlationId == uuid) {
          const response = JSON.parse(msg.content.toString());
          clearTimeout(timeoutId)
          resolve(response);
        }
      }, { noAck: true })
    });

    channel.close();

    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const handleRPC = async (queueName, process) => {
  const channel = await getChannel();

  await channel.assertQueue(queueName, { durable: true });
  channel.prefetch(1);
  channel.consume(queueName, async (msg) => {

    const data = await process(JSON.parse(msg.content.toString()))
    channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(data)), {
      contentType: 'application/json',
      correlationId: msg.properties.correlationId
    })

    channel.ack(msg);

  }, { noAck: false })
};

const generateUuid = () => {
  return Math.random().toString() + Math.random().toString() + Math.random().toString();
};

module.exports = {
  initMQ,
  publishToTopic,
  subscribeToTopic,
  callRPC,
  handleRPC
};