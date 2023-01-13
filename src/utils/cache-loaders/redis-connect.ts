import Config from "../config";
const redis = require("redis");
const redisClient = redis.createClient();

(async () => {
  await redisClient.connect({
    url: Config.redis.productionUrl,
    port: Config.redis.productionPort,
  });
})();

console.log("Connecting to the Redis");

redisClient.on("ready", () => {
  console.log("Connected!");
});

redisClient.on("error", (err: any) => {
  console.log("Error in the Connection");
});

export default redisClient;
