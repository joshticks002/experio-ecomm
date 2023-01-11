import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import BadRequestError from "../errors/bad-request";
import expressAsyncHandler from "express-async-handler";

const validatePassword = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      password: Joi.string().min(8).required(),
      confirm_password: Joi.string().min(8).required(),
    });

    await schema.validateAsync(req.body);

    const { password, confirm_password } = req.body;

    if (password !== confirm_password) {
      throw new BadRequestError("Passwords do not match");
    }

    next();
  }
);

export default validatePassword;
