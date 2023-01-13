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
const email_verification_1 = __importDefault(require("../utils/template/email-verification"));
const forgot_password_template_1 = __importDefault(require("../utils/template/forgot-password-template"));
const redis_loader_1 = __importDefault(require("../utils/cache-loaders/redis-loader"));
const { generateToken } = require("../utils/utils");
const bcrypt = require("bcryptjs");
const redis_connect_1 = __importDefault(require("../utils/cache-loaders/redis-connect"));
const email_queue_1 = __importDefault(require("./queues/email.queue"));
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
    redis_loader_1.default.set(reference, JSON.stringify(req.body));
    redis_loader_1.default.expire(reference, 60 * 100);
    redis_loader_1.default.set(temporaryUserKey, "1");
    redis_loader_1.default.expire(temporaryUserKey, 60 * 100);
    const url = `https://experio-ecomm.up.railway.app/verify-email?reference=${reference}`;
    const emailData = {
        content: (0, email_verification_1.default)(fullname, url),
        to: email,
        subject: "Techy_Jo Registration Confirmation",
    };
    (0, email_queue_1.default)(emailData);
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
    redis_loader_1.default.del(temporaryUserKey);
    redis_loader_1.default.del(reference);
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
    redis_connect_1.default.del(blacklistedTokenKey);
    const { fullname, gender, phone, address } = user;
    res.status(200).json({
        message: "User login successful",
        data: {
            token,
            user: {
                fullname,
                email,
                phone,
                address,
                gender,
            },
        },
        status: true,
    });
});
const forgotPassword = (0, express_async_handler_1.default)(async (req, res) => {
    const { email } = req.body;
    const user = (await users_model_1.default.findOne({ email }));
    if (!user) {
        throw new not_found_1.default("User not found");
    }
    const reference = (0, uuid_1.v4)();
    redis_loader_1.default.set(reference, email);
    redis_loader_1.default.expire(reference, 60 * 100);
    const url = `https://experio-ecomm.up.railway.app/reset-password?reference=${reference}`;
    const emailData = {
        content: (0, forgot_password_template_1.default)(user.fullname, url),
        to: email,
        subject: "Techy_Jo Password Reset",
    };
    (0, email_queue_1.default)(emailData);
    res.status(200).json({
        message: "Forgot password link sent",
        data: {},
        status: true,
    });
});
const resetPassword = (0, express_async_handler_1.default)(async (req, res) => {
    const reference = req.query.reference;
    const { password } = req.body;
    if (!reference) {
        throw new bad_request_1.default("Invalid Reference");
    }
    const userEmail = (await redis_loader_1.default.get(reference));
    if (!userEmail) {
        throw new bad_request_1.default("Link has expired");
    }
    const user = (await users_model_1.default.findOne({ email: userEmail }));
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    await users_model_1.default.update({ id: user.id }, user);
    redis_loader_1.default.del(reference);
    res.status(200).json({
        message: "Password reset successful",
        data: {},
        status: true,
    });
});
const handleLogout = (0, express_async_handler_1.default)(async (req, res) => {
    const { email } = res.locals.payload;
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
    forgotPassword,
    resetPassword,
    handleLogout,
};
