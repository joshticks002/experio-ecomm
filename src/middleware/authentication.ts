import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken"
import Config from "../utils/config";
import expressAsyncHandler from "express-async-handler";
import UnauthenticatedError from "../errors/unauthenticated";

const {
    JWT: { secret, subject, issuer }
} = Config;

const validateToken = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies.Token || null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(" ")[1]

            const payload: jwt.JwtPayload = jwt.verify(token, secret, {
                issuer: issuer,
                subject: subject
            }) as jwt.JwtPayload

            res.locals.payload = payload
            res.locals.token = token

            next()
        } catch(err: any) {
            throw new UnauthenticatedError(err.message)
        }
    } else if (token) {
        try {
            const payload: jwt.JwtPayload = jwt.verify(token, secret, {
                issuer: issuer,
                subject: subject
            }) as jwt.JwtPayload

            res.locals.payload = payload
            res.locals.token = token

            next()
        } catch(err: any) {
            throw new UnauthenticatedError(err.message)
        }
    } else {
        throw new UnauthenticatedError("Provide token for authorization")
    }
})

export default validateToken;