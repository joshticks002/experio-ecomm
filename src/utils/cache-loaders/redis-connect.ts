import Config from "../config";
const redis = require("redis");

const redisClient = redis.createClient({
  legacyMode: true,
  url: Config.redis.productionUrl,
});

(async () => {
  await redisClient.connect();
})();

redisClient.on("ready", () => {
  console.log("Connected!");
});

redisClient.on("error", (err: any) => {
  console.log("Error in the Connection");
});

export default redisClient;
