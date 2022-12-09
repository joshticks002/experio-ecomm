"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { StatusCodes } = require('http-status-codes');
const custom_api_1 = __importDefault(require("./custom-api"));
class NotFoundError extends custom_api_1.default {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
        this.message = message;
    }
}
exports.default = NotFoundError;
