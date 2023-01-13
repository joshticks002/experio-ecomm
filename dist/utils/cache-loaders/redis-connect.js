"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis = require("redis");
const redisClient = redis.createClient({
    url: "rediss:\\default:3MwcgSEXcrTrCyWFhZM2@containers-us-west-196.railway.app:7823",
    socket: {
        tls: true,
        servername: "containers-us-west-196.railway.app",
    },
});
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
