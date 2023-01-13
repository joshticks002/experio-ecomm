const Redis = require("redis");
import Config from "../config";

const redisClient = Redis.createClient({
  legacyMode: true,
  socket: {
    host: Config.redis.productionHost,
    port: Config.redis.productionPort,
  },
  password: Config.redis.productionPassword,
});
redisClient.connect().catch(console.error, "Redis not connected");

export default redisClient;
