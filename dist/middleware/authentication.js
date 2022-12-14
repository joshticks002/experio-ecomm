"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("jsonwebtoken"));
const config_1 = __importDefault(require("../utils/config"));
const bad_request_1 = __importDefault(require("../errors/bad-request"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const unauthenticated_1 = __importDefault(require("../errors/unauthenticated"));
const redis_connect_1 = __importDefault(require("../utils/cache-loaders/redis-connect"));
const { JWT: { secret, subject, issuer }, } = config_1.default;
const validateToken = (0, express_async_handler_1.default)(async (req, res, next) => {
    let token = req.cookies.Token || null;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const payload = jwt.verify(token, secret, {
                issuer: issuer,
                subject: subject,
            });
            const blacklistedTokenKey = `token:blacklist:${payload.email}`;
            redis_connect_1.default.get(blacklistedTokenKey, (error, verifier) => {
                if (error)
                    console.error(error);
                if (verifier) {
                    return next(new bad_request_1.default("Please, login again. Session Expired"));
                }
                else {
                    res.locals.payload = payload;
                    res.locals.token = token;
                    next();
                }
            });
        }
        catch (err) {
            throw new unauthenticated_1.default(err.message);
        }
    }
    else {
        throw new unauthenticated_1.default("Provide token for authorization");
    }
});
exports.default = validateToken;
