const { callRPC } = require("../services/rabbitmq");

const authtokenRequest = async (username, rolename) => {
    const queueName = "authtoken_request";

    const data = await callRPC(queueName, {username, rolename});  
    
    return data;
};

module.exports = { 
    authtokenRequest
}