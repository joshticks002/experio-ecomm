"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const users_model_1 = __importDefault(require("../models/users.model"));
const uuid_1 = require("uuid");
const bad_request_1 = __importDefault(require("../errors/bad-request"));
const not_found_1 = __importDefault(require("../errors/not-found"));
const email_service_1 = __importDefault(require("../services/email.service"));
const email_template_1 = __importDefault(require("../utils/email-template"));
const redis_loader_1 = __importDefault(require("../utils/cache-loaders/redis-loader"));
const { generateToken } = require("../utils/utils");
const bcrypt = require("bcryptjs");
const redis_connect_1 = __importDefault(require("../utils/cache-loaders/redis-connect"));
const registerUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { password, fullname, email } = req.body;
    const temporaryUserKey = `prospective:user:${email}`;
    const [userExists, isTemporaryUser] = await Promise.all([
        users_model_1.default.findOne({ email: req.body.email }),
        redis_loader_1.default.get(temporaryUserKey),
    ]);
    if (userExists || isTemporaryUser) {
        throw new bad_request_1.default("User account exists already");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    delete req.body.confirm_password;
    const reference = (0, uuid_1.v4)();
    await redis_loader_1.default.set(reference, JSON.stringify(req.body));
    await redis_loader_1.default.expire(reference, 60 * 100);
    await redis_loader_1.default.set(temporaryUserKey, "1");
    await redis_loader_1.default.expire(temporaryUserKey, 60 * 100);
    const url = `http://localhost:3003/verify-email?reference=${reference}`;
    const emailData = {
        content: (0, email_template_1.default)(fullname, url),
        to: email,
        subject: "Techy_Jo Registration Confirmation",
    };
    await (0, email_service_1.default)(emailData);
    res.status(201).json({
        message: "Email verification link sent",
        data: {},
        status: true,
    });
});
const verifyEmail = (0, express_async_handler_1.default)(async (req, res) => {
    const reference = req.query.reference;
    if (!reference) {
        throw new bad_request_1.default("Invalid Reference");
    }
    const isReference = (await redis_loader_1.default.get(reference));
    if (!isReference) {
        throw new bad_request_1.default("Link has expired");
    }
    const userData = JSON.parse(isReference);
    const temporaryUserKey = `prospective:user:${userData.email}`;
    const user = (await users_model_1.default.create(userData));
    await redis_loader_1.default.del(temporaryUserKey);
    await redis_loader_1.default.del(reference);
    res.status(200).json({
        message: "Your account has been successfully verified",
        data: {},
        status: true,
    });
});
const handleLogin = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const user = (await users_model_1.default.findOne({ email }));
    if (!user) {
        throw new not_found_1.default("User account not found");
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
        throw new bad_request_1.default("Invalid login credentials");
    }
    const tokenData = {
        id: user.id,
        email,
        fullname: user.fullname,
    };
    const token = generateToken(tokenData);
    const blacklistedTokenKey = `token:blacklist:${email}`;
    await redis_connect_1.default.del(blacklistedTokenKey);
    res.status(200).json({
        message: "User login successful",
        data: {
            token,
        },
        status: true,
    });
});
const handleLogout = (0, express_async_handler_1.default)(async (req, res) => {
    const { email } = res.locals.payload;
    console.log(email);
    const blacklistedTokenKey = `token:blacklist:${email}`;
    redis_connect_1.default.set(blacklistedTokenKey, "yes");
    res.status(200).json({
        message: "User logout successful",
        data: {},
        status: true,
    });
});
module.exports = {
    registerUser,
    verifyEmail,
    handleLogin,
    handleLogout,
};
