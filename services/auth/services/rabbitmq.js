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

module.exports = {
  connect
};