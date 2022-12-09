import BadRequestError from "../errors/bad-request";
import { Request, Response, NextFunction } from "express"
import expressAsyncHandler from "express-async-handler";

const validateFileUpload = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file || !req.file?.path || !req.file?.filename) {
        throw new BadRequestError("Upload an image file not more than 1mb")
    }

    req.body.image = req.file?.path

    next()
})

export default validateFileUpload;