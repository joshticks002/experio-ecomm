import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import Config from "../utils/config";
import BadRequestError from "../errors/bad-request";
import expressAsyncHandler from "express-async-handler";
import UnauthenticatedError from "../errors/unauthenticated";
import redisClient from "../utils/cache-loaders/redis-connect";

const {
  JWT: { secret, subject, issuer },
} = Config;

const validateToken = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies.Token || null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];

        const payload: jwt.JwtPayload = jwt.verify(token, secret, {
          issuer: issuer,
          subject: subject,
        }) as jwt.JwtPayload;

        const blacklistedTokenKey = `token:blacklist:${payload.email}`;
        redisClient.get(blacklistedTokenKey, (error: any, verifier: string) => {
          if (error) console.error(error);

          if (verifier) {
            return next(
              new BadRequestError("Please, login again. Session Expired")
            );
          } else {
            res.locals.payload = payload;
            res.locals.token = token;

            next();
          }
        });
      } catch (err: any) {
        throw new UnauthenticatedError(err.message);
      }
    } else {
      throw new UnauthenticatedError("Provide token for authorization");
    }
  }
);

export default validateToken;
