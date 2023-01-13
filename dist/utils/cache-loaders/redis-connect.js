"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const redis = require("redis");
const redisClient = redis.createClient({
    legacyMode: true,
    url: config_1.default.redis.productionUrl,
});
(async () => {
    await redisClient.connect();
})();
redisClient.on("ready", () => {
    console.log("Connected!");
});
redisClient.on("error", (err) => {
    console.log("Error in the Connection");
});
exports.default = redisClient;
