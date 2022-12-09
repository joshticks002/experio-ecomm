import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import productModel from "../models/products.model";
import BadRequestError from "../errors/bad-request";
import { IProducts } from "../../typings.d"


export const addProduct = expressAsyncHandler(async (req: Request, res: Response) => {
    req.body.price = `N${req.body.price}`
    const product = await productModel.create(req.body) as IProducts;

    res.status(201).json({
        message: "Product successfully added",
        data: {
            product
        },
        status: true
    })
})

export const getProducts = expressAsyncHandler(async (req: Request, res: Response) => {
    const products = await productModel.find() as IProducts[];

    res.status(200).json({
        message: "All products retrieved",
        data: {
            products
        },
        status: true
    })
})

export const getProductById = expressAsyncHandler(async (req: Request, res: Response) => {
    const product = await productModel.findOne({ id: Number(req.params.id) }) as IProducts;

    if (!product) {
        throw new BadRequestError("Product not found")
    }

    res.status(200).json({
        message: "Product retrieved",
        data: {
            product
        },
        status: true
    })
})

export const updateProductById = expressAsyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const product = await productModel.findOne({ id }) as IProducts;

    if (!product) {
        throw new BadRequestError("Product not found")
    }

    req.body.price = `N${req.body.price}`
    const updatedProduct = await productModel.update({ id }, { id, ...req.body }) as IProducts;

    res.status(200).json({
        message: `Product with id ${id} updated successfully`,
        data: {
            updatedProduct
        },
        status: true
    })
})

export const deleteProductById = expressAsyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const product = await productModel.findOne({ id }) as IProducts;

    if (!product) {
        throw new BadRequestError("Product not found")
    }

    await productModel.remove({ id })

    res.status(200).json({
        message: `Product with id ${id} deleted successfully`,
        data: {},
        status: true
    })
})