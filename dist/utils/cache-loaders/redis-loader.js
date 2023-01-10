"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tedis_1 = require("tedis");
const config_1 = __importDefault(require("../config"));
let tedis = new tedis_1.Tedis({
    host: config_1.default.redis.host,
    password: config_1.default.redis.password,
    port: config_1.default.redis.port,
});
tedis.on("connect", () => {
    console.log("Redis Connection Established");
});
exports.default = tedis;
