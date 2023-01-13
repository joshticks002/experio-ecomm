import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import userModel from "../models/users.model";
import { v4 } from "uuid";
import BadRequestError from "../errors/bad-request";
import NotFoundError from "../errors/not-found";
import { IUser } from "../../typings";
import Config from "../utils/config";
import emailMessage from "../utils/template/email-verification";
import forgotPasswordMessage from "../utils/template/forgot-password-template";
import tedis from "../utils/cache-loaders/redis-loader";
const { generateToken } = require("../utils/utils");
const bcrypt = require("bcryptjs");
import redisClient from "../utils/cache-loaders/redis-connect";
import sendEmailJob from "./queues/email.queue";

const registerUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { password, fullname, email } = req.body;
    const temporaryUserKey = `prospective:user:${email}`;

    const [userExists, isTemporaryUser] = await Promise.all([
      userModel.findOne({ email: req.body.email }),
      tedis.get(temporaryUserKey),
    ]);

    if (userExists || isTemporaryUser) {
      throw new BadRequestError("User account exists already");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    delete req.body.confirm_password;

    const reference = v4();

    tedis.set(reference, JSON.stringify(req.body));
    tedis.expire(reference, 60 * 100);
    tedis.set(temporaryUserKey, "1");
    tedis.expire(temporaryUserKey, 60 * 100);

    const url = `http://localhost:3003/verify-email?reference=${reference}`;
    const emailData = {
      content: emailMessage(fullname, url),
      to: email,
      subject: "Techy_Jo Registration Confirmation",
    };

    sendEmailJob(emailData);

    res.status(201).json({
      message: "Email verification link sent",
      data: {},
      status: true,
    });
  }
);

const verifyEmail = expressAsyncHandler(async (req: Request, res: Response) => {
  const reference = req.query.reference as string;

  if (!reference) {
    throw new BadRequestError("Invalid Reference");
  }

  const isReference = (await tedis.get(reference)) as string;

  if (!isReference) {
    throw new BadRequestError("Link has expired");
  }

  const userData = JSON.parse(isReference);
  const temporaryUserKey = `prospective:user:${userData.email}`;

  const user: IUser = (await userModel.create(userData)) as IUser;

  tedis.del(temporaryUserKey);
  tedis.del(reference as string);

  res.status(200).json({
    message: "Your account has been successfully verified",
    data: {},
    status: true,
  });
});

const handleLogin = expressAsyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = (await userModel.findOne({ email })) as IUser;

  if (!user) {
    throw new NotFoundError("User account not found");
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password);

  if (!isCorrectPassword) {
    throw new BadRequestError("Invalid login credentials");
  }

  const tokenData: Record<string, any> = {
    id: user.id,
    email,
    fullname: user.fullname,
  };

  const token = generateToken(tokenData) as string;

  const blacklistedTokenKey = `token:blacklist:${email}`;
  redisClient.del(blacklistedTokenKey);

  const { fullname, gender, phone, address } = user;

  res.status(200).json({
    message: "User login successful",
    data: {
      token,
      user: {
        fullname,
        email,
        phone,
        address,
        gender,
      },
    },
    status: true,
  });
});

const forgotPassword = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = (await userModel.findOne({ email })) as IUser;

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const reference = v4();
    tedis.set(reference, email);
    tedis.expire(reference, 60 * 100);

    const url = `http://localhost:3003/reset-password?reference=${reference}`;

    const emailData = {
      content: forgotPasswordMessage(user.fullname, url),
      to: email,
      subject: "Techy_Jo Password Reset",
    };

    sendEmailJob(emailData);

    res.status(200).json({
      message: "Forgot password link sent",
      data: {},
      status: true,
    });
  }
);

const resetPassword = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const reference = req.query.reference as string;
    const { password } = req.body;

    if (!reference) {
      throw new BadRequestError("Invalid Reference");
    }

    const userEmail = (await tedis.get(reference)) as string;

    if (!userEmail) {
      throw new BadRequestError("Link has expired");
    }

    const user = (await userModel.findOne({ email: userEmail })) as IUser;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;

    await userModel.update({ id: user.id }, user);

    tedis.del(reference as string);

    res.status(200).json({
      message: "Password reset successful",
      data: {},
      status: true,
    });
  }
);

const handleLogout = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { email } = res.locals.payload;

    const blacklistedTokenKey = `token:blacklist:${email}`;
    redisClient.set(blacklistedTokenKey, "yes");

    res.status(200).json({
      message: "User logout successful",
      data: {},
      status: true,
    });
  }
);

module.exports = {
  registerUser,
  verifyEmail,
  handleLogin,
  forgotPassword,
  resetPassword,
  handleLogout,
};
