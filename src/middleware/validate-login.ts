import Joi from "joi";
import { Request, Response, NextFunction } from "express"
import expressAsyncHandler from "express-async-handler";

const validateLogin = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        email: Joi.string().email().required(), 
        password: Joi.string().min(8).required()
    })

    await schema.validateAsync(req.body)

    next()
})

export default validateLogin;