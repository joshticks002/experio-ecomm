"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const model_service_1 = __importDefault(require("../services/model.service"));
const userDatabase = require('../../users.json');
const userModel = new model_service_1.default(userDatabase, "./users.json");
exports.default = userModel;
