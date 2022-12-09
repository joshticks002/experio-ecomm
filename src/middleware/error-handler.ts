import { NextFunction, Request, Response } from "express";
import { HttpError } from 'http-errors'
const { StatusCodes } = require('http-status-codes');

const errorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode ? err.statusCode : StatusCodes.INTERNAL_SERVER_ERROR

    res.status(statusCode).json({
        message: err.message || "INTERNAL SERVER ERROR",
        data: {},
        status: statusCode
    })
}

export default errorHandler;