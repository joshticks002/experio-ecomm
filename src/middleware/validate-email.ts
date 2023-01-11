import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";

const validateEmail = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
    });

    await schema.validateAsync(req.body);

    next();
  }
);

export default validateEmail;
