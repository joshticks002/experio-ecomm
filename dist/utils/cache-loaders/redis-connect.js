"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Redis = require("redis");
const config_1 = __importDefault(require("../config"));
const redisClient = Redis.createClient({
    legacyMode: true,
    PORT: config_1.default.redis.localPort,
});
redisClient.connect().catch(console.error);
exports.default = redisClient;
