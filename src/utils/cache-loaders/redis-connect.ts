const Redis = require("redis");
import Config from "../config";

const redisClient = Redis.createClient({
  socket: {
    host: Config.redis.productionHost,
    port: Config.redis.productionPort,
  },
  password: Config.redis.productionPassword,
});
redisClient.on("error", (err: any) => console.error("Redis not connected"));
redisClient.connect().catch(console.error);

export default redisClient;
