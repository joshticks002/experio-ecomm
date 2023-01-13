const Redis = require("redis");
import Config from "../config";

const redisClient = Redis.createClient({
  legacyMode: true,
  host: Config.redis.productionHost,
  port: Config.redis.productionPort,
});
redisClient.on("error", (err: any) => console.error("Redis not connected"));
redisClient.on("connect", (err: any) => console.error("Redis connected"));
redisClient.connect().catch(console.error);

export default redisClient;
