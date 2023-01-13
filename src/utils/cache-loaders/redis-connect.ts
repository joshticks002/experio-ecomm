import Config from "../config";
const redis = require("redis");

const redisClient = redis.createClient(7823, "127.0.0.1");

(async () => {
  await redisClient.connect();
})();

console.log("Connecting to the Redis");

redisClient.on("ready", () => {
  console.log("Connected!");
});

redisClient.on("error", (err: any) => {
  console.log("Error in the Connection");
});

export default redisClient;
