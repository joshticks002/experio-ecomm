"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const email_service_1 = __importDefault(require("../../services/email.service"));
const emailProcess = async (job) => {
    await (0, email_service_1.default)(job.data);
};
exports.default = emailProcess;
