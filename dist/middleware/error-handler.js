"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { StatusCodes } = require('http-status-codes');
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode ? err.statusCode : StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json({
        message: err.message || "INTERNAL SERVER ERROR",
        data: {},
        status: statusCode
    });
};
exports.default = errorHandler;
