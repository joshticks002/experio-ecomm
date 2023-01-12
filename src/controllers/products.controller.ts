import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import productModel from "../models/products.model";
import BadRequestError from "../errors/bad-request";
import redisClient from "../utils/cache-loaders/redis-connect";
import { IProducts } from "../../typings.d";
import listRange from "../utils/paginate-data";

export const addProduct = expressAsyncHandler(
  async (req: Request, res: Response) => {
    req.body.price = `N${req.body.price}`;
    const [product, count] = await Promise.all([
      productModel.create(req.body),
      productModel.count(),
    ]);
    const lastPage = count / 10 >= 1 ? count : 1;

    redisClient.del(`products?page=${lastPage}`);

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
    let totalCount: number;
    const query = req.query;
    const bus: any = {};
    let path = "";
    const queryKeys = Object.keys(req.query);
    let queryPage = Number(req.query.page) || 1;
    const page = listRange(queryPage);

    if (queryKeys.length) path = req.originalUrl.split("?")[1];

    if (query.name) {
      bus.name = query.name;
    }

    if (query.brand) {
      bus.brand = query.brand;
    }

    if (query.category) {
      bus.category = query.category;
    }

    if (query.price) {
      bus.category = query.price;
    }

    if (query.rating) {
      bus.rating = query.rating;
    }

    redisClient.get(
      `products?${path}`,
      async (error: any, products: string) => {
        if (error) console.error(error);

        if (products != null) {
          const parsedData = JSON.parse(products);
          productsData = parsedData.products;
          totalCount = parsedData.count;
        } else {
          const [desiredProducts, productCount] = await Promise.all([
            productModel.find(bus, page),
            productModel.count(),
          ]);

          productsData = desiredProducts as IProducts[];
          totalCount = productCount;

          if (productsData.length) {
            redisClient.setex(
              `products?${path}`,
              3600,
              JSON.stringify({ products: productsData, count: totalCount })
            );
          }
        }

        res.status(200).json({
          message: "Desired products retrieved",
          data: {
            products: productsData,
            total_products: totalCount,
            page: queryPage ? Number(queryPage) : 1,
            per_page: 10,
            total_pages: totalCount > 10 ? totalCount / 10 : 1,
          },
          status: true,
        });
      }
    );
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
    redisClient.del("products?");
    redisClient.del(`products:${id}`);

    res.status(200).json({
      message: `Product with id ${id} deleted successfully`,
      data: {},
      status: true,
    });
  }
);
