
const { generateToken } = require("../services/auth");
const { handleRPC } = require("../services/rabbitmq");

const processAuthTokenRequest = () => {
    const queueName = "authtoken_request";

    handleRPC(queueName, async (data) => {
        const token = await generateToken(data.username, data.rolename);
        return token;
    })
}

const loadAll = async () => {
    console.log("loading all subscribers");
    await processAuthTokenRequest();
    console.log("loaded all subscribers")
}

loadAll();