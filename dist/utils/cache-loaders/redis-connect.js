"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Redis = require("redis");
const config_1 = __importDefault(require("../config"));
const redisClient = Redis.createClient({
    legacyMode: true,
    socket: {
        host: config_1.default.redis.productionHost,
        port: config_1.default.redis.productionPort,
    },
    password: config_1.default.redis.productionPassword,
});
redisClient.connect().catch(console.error, "Redis not connected");
exports.default = redisClient;
