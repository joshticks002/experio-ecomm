const Redis = require("redis");
import Config from "../config";

// const redisClient = Redis.createClient({
//   host: Config.redis.productionHost,
//   port: Config.redis.productionPort,
// });
// redisClient.on("error", (err: any) => console.error("Redis not connected"));
// redisClient.connect().catch(console.error);
// redisClient.auth("default", Config.redis.productionPassword);

const redisClient = Redis.createClient();
redisClient.on("error", (err: any) => console.error("Redis not connected"));
redisClient.connect().catch(console.error);

export default redisClient;
