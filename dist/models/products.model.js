"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const model_service_1 = __importDefault(require("../services/model.service"));
const productDatabase = require('../../products.json');
const productModel = new model_service_1.default(productDatabase, "./products.json");
exports.default = productModel;
