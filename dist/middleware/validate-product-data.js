"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const validateProductData = (0, express_async_handler_1.default)(async (req, res, next) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required(),
        brand: joi_1.default.string().required(),
        category: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        price: joi_1.default.number().min(1).required(),
        countInStock: joi_1.default.number().min(1).required(),
        rating: joi_1.default.number().min(1).max(5).required(),
        numReviews: joi_1.default.number().min(0).required(),
    });
    await schema.validateAsync(req.body);
    next();
});
exports.default = validateProductData;
