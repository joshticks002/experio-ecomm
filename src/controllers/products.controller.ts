import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import productModel from "../models/products.model";
import BadRequestError from "../errors/bad-request";
import redisClient from "../utils/cache-loaders/redis-connect";
import { IProducts } from "../../typings.d";

export const addProduct = expressAsyncHandler(
  async (req: Request, res: Response) => {
    req.body.price = `N${req.body.price}`;
    const product = (await productModel.create(req.body)) as IProducts;
    redisClient.del("products");

    res.status(201).json({
      message: "Product successfully added",
      data: {
        product,
      },
      status: true,
    });
  }
);

export const getProducts = expressAsyncHandler(
  async (req: Request, res: Response) => {
    let productsData: Promise<any> | IProducts[];

    redisClient.get("products", async (error: any, products: string) => {
      if (error) console.error(error);

      if (products != null) {
        productsData = JSON.parse(products);
      } else {
        productsData = (await productModel.find()) as IProducts[];
        redisClient.setex("products", 3600, JSON.stringify(productsData));
      }

      res.status(200).json({
        message: "All products retrieved",
        data: {
          products: productsData,
        },
        status: true,
      });
    });
  }
);

export const getProductById = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let productData: Promise<any> | IProducts;

    redisClient.get(`products:${id}`, async (error: any, product: string) => {
      if (error) console.error(error);

      if (product != null) {
        productData = JSON.parse(product);
      } else {
        productData = (await productModel.findOne({
          id: Number(req.params.id),
        })) as IProducts;

        if (!productData) {
          return next(new BadRequestError("Product not found"));
        }

        redisClient.setex(`products:${id}`, 36000, JSON.stringify(productData));
      }

      res.status(200).json({
        message: "Product retrieved",
        data: {
          product: productData,
        },
        status: true,
      });
    });
  }
);

export const updateProductById = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const product = (await productModel.findOne({ id })) as IProducts;

    if (!product) {
      throw new BadRequestError("Product not found");
    }

    req.body.price = `N${req.body.price}`;
    const updatedProduct = (await productModel.update(
      { id },
      { id, ...req.body }
    )) as IProducts;

    redisClient.del(`products:${id}`);
    redisClient.setex(`products:${id}`, 36000, JSON.stringify(updatedProduct));

    res.status(200).json({
      message: `Product with id ${id} updated successfully`,
      data: {
        updatedProduct,
      },
      status: true,
    });
  }
);

export const deleteProductById = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const product = (await productModel.findOne({ id })) as IProducts;

    if (!product) {
      throw new BadRequestError("Product not found");
    }

    await productModel.remove({ id });
    redisClient.del("products");
    redisClient.del(`products:${id}`);

    res.status(200).json({
      message: `Product with id ${id} deleted successfully`,
      data: {},
      status: true,
    });
  }
);
