import Config from "../config";
const redis = require("redis");

const redisClient = redis.createClient({
  url: Config.redis.productionUrl,
  port: Config.redis.productionPort,
});

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
