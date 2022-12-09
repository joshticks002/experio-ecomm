import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import userModel from "../models/users.model";
import BadRequestError from "../errors/bad-request";
import NotFoundError from "../errors/not-found";
import { IUser } from "../../typings"
import Config from "../utils/config";
import sendEmail from "../services/email.service";
import emailMessage from "../utils/email-template";
const { generateToken } = require('../utils/utils')
const bcrypt = require("bcryptjs");

const registerUser = expressAsyncHandler(async(req: Request, res: Response) => {
    const { password, fullname, email } = req.body
    const userExists = await userModel.findOne({ email: req.body.email })

    if (userExists) {
        throw new BadRequestError("User account exists already")
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword
    delete req.body.confirm_password

    const url = `${Config.serverPort}/login`
    const emailData = { 
        content: emailMessage(fullname,url),
        to: email, 
        subject : "Techy_Jo Registration Confirmation"
    }

    await sendEmail(emailData)

    const user: IUser = await userModel.create(req.body) as IUser
    delete user.password
    
    res.status(201).json({ 
        message: "User created successfully", 
        data: { user }, 
        status: true 
    })
})

const handleLogin = expressAsyncHandler(async(req: Request, res: Response) => {
    const { email, password } = req.body
    const user = await userModel.findOne({ email }) as IUser

    if (!user) {
        throw new NotFoundError("User account not found")
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password)

    if (!isCorrectPassword) {
        throw new BadRequestError("Invalid login credentials")
    }

    const tokenData: Record<string, any> = {
        id: user.id,
        email,
        fullname: user.fullname
    }

    const token = generateToken(tokenData) as string;
    res.cookie("Token", token)
    res.cookie("Username", user.fullname)
    res.cookie("UserId", user.id)

    res.status(200).json({
        message: "User login successful",
        data: {
            token
        },
        status: true
    })
})

const handleLogout = expressAsyncHandler(async(req: Request, res: Response) => {
    res.cookie("Token", "")
    res.cookie("Username", "")
    res.cookie("UserId", "")

    res.status(200).json({
        message: "User logout successful",
        data: { },
        status: true
    })
})

module.exports = {
    registerUser,
    handleLogin,
    handleLogout
}