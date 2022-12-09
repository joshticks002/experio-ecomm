import Joi from "joi";
import { Request, Response, NextFunction } from "express"
import expressAsyncHandler from "express-async-handler";

const validateProductData = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().required(), 
        image: Joi.string().required(),
        brand: Joi.string().required(),
        category: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().min(1).required(),
        countInStock: Joi.number().min(1).required(),
        rating: Joi.number().min(1).max(5).required(),
        numReviews: Joi.number().min(0).required(),
    })

    await schema.validateAsync(req.body)

    next()
})

export default validateProductData;