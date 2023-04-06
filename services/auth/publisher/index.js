const { callRPC } = require("../services/rabbitmq");

const publishUserDataRequest = async (username) => {
    const queueName = "userdata_request"

    const data = await callRPC(queueName, username);  
    
    return data;
};

module.exports = { 
    publishUserDataRequest
}