const Redis = require("redis");
import Config from "../config";

const redisClient = Redis.createClient({
  url: Config.redis.productionHost,
});
redisClient.on("error", (err: any) => console.error("Redis not connected"));
redisClient.connect().catch(console.error);

export default redisClient;
