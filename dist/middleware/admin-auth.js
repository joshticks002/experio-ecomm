"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bad_request_1 = __importDefault(require("../errors/bad-request"));
const users_model_1 = __importDefault(require("../models/users.model"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const validateAdmin = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = (await users_model_1.default.findOne({
        id: Number(res.locals.payload.id),
    }));
    if (!user.role && user.role?.toLowerCase() !== "admin") {
        return next(new bad_request_1.default("Operation not allowed"));
    }
    next();
});
exports.default = validateAdmin;
