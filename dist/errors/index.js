"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const custom_api_1 = __importDefault(require("./custom-api"));
const unauthenticated_1 = __importDefault(require("./unauthenticated"));
const not_found_1 = __importDefault(require("./not-found"));
const bad_request_1 = __importDefault(require("./bad-request"));
const errors = {
    CustomAPIError: custom_api_1.default,
    UnauthenticatedError: unauthenticated_1.default,
    NotFoundError: not_found_1.default,
    BadRequestError: bad_request_1.default,
};
exports.default = errors;
