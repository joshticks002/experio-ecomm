import BadRequestError from "../errors/bad-request";
import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";

const validateFileUpload = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.imageUrl) {
      throw new BadRequestError("Upload an image file not more than 1mb");
    }

    next();
  }
);

export default validateFileUpload;
