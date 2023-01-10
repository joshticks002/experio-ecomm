const Redis = require("redis");
import Config from "../config";

const redisClient = Redis.createClient({
  legacyMode: true,
  PORT: Config.redis.localPort,
});
redisClient.connect().catch(console.error);

export default redisClient;
