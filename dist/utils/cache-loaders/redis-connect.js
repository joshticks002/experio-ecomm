"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Redis = require("redis");
// const redisClient = Redis.createClient({
//   host: Config.redis.productionHost,
//   port: Config.redis.productionPort,
// });
// redisClient.on("error", (err: any) => console.error("Redis not connected"));
// redisClient.connect().catch(console.error);
// redisClient.auth("default", Config.redis.productionPassword);
const redisClient = Redis.createClient();
redisClient.on("error", (err) => console.error("Redis not connected"));
redisClient.connect().catch(console.error);
exports.default = redisClient;
