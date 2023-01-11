"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bull_1 = __importDefault(require("bull"));
const email_process_1 = __importDefault(require("../processes/email.process"));
const redis_connect_1 = __importDefault(require("../../utils/cache-loaders/redis-connect"));
const emailQueue = new bull_1.default("email", {
    redis: redis_connect_1.default,
    limiter: {
        max: 1000,
        duration: 5000,
    },
});
emailQueue.process(email_process_1.default);
emailQueue.on("completed", (job) => {
    console.log(`Job completed`);
});
const sendEmailJob = (data) => {
    emailQueue.add(data, {
        attempts: 2,
    });
};
exports.default = sendEmailJob;
