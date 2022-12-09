"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequestParameter = void 0;
const bad_request_1 = __importDefault(require("../errors/bad-request"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
exports.validateRequestParameter = (0, express_async_handler_1.default)(async (req, res, next) => {
    if (!req.params.id) {
        throw new bad_request_1.default("Invalid Request Parameter. Provide dataId");
    }
    if (req.params.id)
        next();
});
