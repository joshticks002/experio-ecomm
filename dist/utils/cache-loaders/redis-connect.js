"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Redis = require("redis");
const config_1 = __importDefault(require("../config"));
const redisClient = Redis.createClient({
    legacyMode: true,
    port: config_1.default.redis.productionPort,
});
redisClient.on("error", (err) => console.error("Redis not connected"));
redisClient.connect().catch(console.error);
exports.default = redisClient;
