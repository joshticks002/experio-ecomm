import { Request, Response, NextFunction } from "express";
import BadRequestError from "../errors/bad-request";
import expressAsyncHandler from "express-async-handler";

export const validateRequestParameter = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
        throw new BadRequestError("Invalid Request Parameter. Provide dataId")
    }
    
    if (req.params.id) next()  
})
