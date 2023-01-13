import * as dotenv from "dotenv";
const redis = require("redis");
dotenv.config();

const redisClient = redis.createClient({
  legacyMode: true,
  url: process.env.REDIS_URL,
});

(async () => {
  await redisClient.connect();
})();

redisClient.on("ready", () => {
  console.log("Cache Connected!");
});

redisClient.on("error", (err: any) => {
  console.log("Error in cache Connection");
});

export default redisClient;
