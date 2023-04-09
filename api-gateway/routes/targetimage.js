const express = require('express');
const router = express.Router();
const axios = require('axios');
const circuitBreaker = require("opossum");
const { authenticateToken, authenticateTokenRole } = require('../middleware/auth');

const root = "http://" + process.env.COMPETITION_SERVER;


const asyncPostTargetImage = async (req, res, next) => {
  const USER_SERVER = root + "/target-image/";

  try {
    const response = await axios.post(USER_SERVER, req.body, {
      headers: {
        Authorization: req.headers.authorization
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status || 500).json({ error: error.message });
  }
}

// login/
router.post('/', authenticateTokenRole("admin"), asyncPostTargetImage);

const options = {
  timeout: 1, // If our function takes longer than 1 millisecond, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000, // After 30 seconds, try again.
};
const breaker = new circuitBreaker(asyncPostTargetImage, options);
breaker.fallback(() => "Sorry, out of service right now");
breaker.on("fallback", (result) => {
  console.log(result);
});
breaker.on("success", () => console.log("success"));
breaker.on("failure", () => console.log("failed"));
breaker.on("timeout", () => console.log("timed out"));
breaker.on("reject", () => console.log("rejected"));
breaker.on("open", () => console.log("opened"));
breaker.on("halfOpen", () => console.log("halfOpened"));
breaker.on("close", () => console.log("closed"));
breaker
  .fire()
  .then(console.log)
  .catch(console.error);


module.exports = router;
