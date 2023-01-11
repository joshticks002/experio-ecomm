"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const validateEmail = (0, express_async_handler_1.default)(async (req, res, next) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
    });
    await schema.validateAsync(req.body);
    next();
});
exports.default = validateEmail;
