"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis = require("redis");
const redisClient = redis.createClient(7823, "containers-us-west-196.railway.app");
(async () => {
    await redisClient.connect();
})();
console.log("Connecting to the Redis");
redisClient.on("ready", () => {
    console.log("Connected!");
});
redisClient.on("error", (err) => {
    console.log("Error in the Connection");
});
exports.default = redisClient;
