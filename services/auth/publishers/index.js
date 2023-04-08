const { callRPC, publishToTopic } = require("../services/rabbitmq");

const publishUserDataRequest = async (username) => {
    const queueName = "userdata_request";
    
    const data = await callRPC(queueName, username);  
    
    return data;
}; 

const publishDemoRequest = async () => {
    const exchangeName = "user";
    const routingKey = "user.not.demo"
    const demoData = {username: "mister demo"}

    publishToTopic(exchangeName, routingKey, demoData);
    console.log("sended a message for demo request.")
};

module.exports = { 
    publishUserDataRequest,
    publishDemoRequest
}