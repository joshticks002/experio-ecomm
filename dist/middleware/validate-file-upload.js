"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bad_request_1 = __importDefault(require("../errors/bad-request"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const validateFileUpload = (0, express_async_handler_1.default)(async (req, res, next) => {
    if (!req.body.imageUrl) {
        throw new bad_request_1.default("Upload an image file not more than 500kb");
    }
    next();
});
exports.default = validateFileUpload;
