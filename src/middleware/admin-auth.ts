import BadRequestError from "../errors/bad-request";
import userModel from "../models/users.model";
import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { IUser } from "../../typings";

const validateAdmin = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = (await userModel.findOne({
      id: Number(res.locals.payload.id),
    })) as IUser;

    if (!user.role && user.role?.toLowerCase() !== "admin") {
      return next(new BadRequestError("Operation not allowed"));
    }

    next();
  }
);

export default validateAdmin;
