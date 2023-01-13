"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductById = exports.updateProductById = exports.getProductById = exports.getProducts = exports.addProduct = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const products_model_1 = __importDefault(require("../models/products.model"));
const bad_request_1 = __importDefault(require("../errors/bad-request"));
const redis_connect_1 = __importDefault(require("../utils/cache-loaders/redis-connect"));
const paginate_data_1 = __importDefault(require("../utils/paginate-data"));
exports.addProduct = (0, express_async_handler_1.default)(async (req, res) => {
    req.body.price = `N${req.body.price}`;
    const [product, count] = await Promise.all([
        products_model_1.default.create(req.body),
        products_model_1.default.count(),
    ]);
    const lastPage = count / 10 >= 1 ? count : 1;
    redis_connect_1.default.del(`products?page=${lastPage}`);
    redis_connect_1.default.del(`products?`);
    res.status(201).json({
        message: "Product successfully added",
        data: {
            product,
        },
        status: true,
    });
});
exports.getProducts = (0, express_async_handler_1.default)(async (req, res) => {
    let productsData;
    let totalCount;
    const query = req.query;
    const bus = {};
    let path = "";
    const queryKeys = Object.keys(req.query);
    let queryPage = Number(req.query.page) || 1;
    const page = (0, paginate_data_1.default)(queryPage);
    if (queryKeys.length)
        path = req.originalUrl.split("?")[1];
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
        bus.price = query.price;
    }
    if (query.rating) {
        bus.rating = query.rating;
    }
    redis_connect_1.default.get(`products?${path}`, async (error, products) => {
        if (error)
            console.error(error);
        if (products != null) {
            const parsedData = JSON.parse(products);
            productsData = parsedData.products;
            totalCount = parsedData.count;
        }
        else {
            const [desiredProducts, productCount] = await Promise.all([
                products_model_1.default.find(bus, page),
                products_model_1.default.count(),
            ]);
            productsData = desiredProducts;
            totalCount = productCount;
            if (productsData.length) {
                redis_connect_1.default.setex(`products?${path}`, 3600, JSON.stringify({ products: productsData, count: totalCount }));
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
    });
});
exports.getProductById = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    let productData;
    redis_connect_1.default.get(`products:${id}`, async (error, product) => {
        if (error)
            console.error(error);
        if (product != null) {
            productData = JSON.parse(product);
        }
        else {
            productData = (await products_model_1.default.findOne({
                id: Number(req.params.id),
            }));
            if (!productData) {
                return next(new bad_request_1.default("Product not found"));
            }
            redis_connect_1.default.setex(`products:${id}`, 36000, JSON.stringify(productData));
        }
        res.status(200).json({
            message: "Product retrieved",
            data: {
                product: productData,
            },
            status: true,
        });
    });
});
exports.updateProductById = (0, express_async_handler_1.default)(async (req, res) => {
    const id = Number(req.params.id);
    const product = (await products_model_1.default.findOne({ id }));
    if (!product) {
        throw new bad_request_1.default("Product not found");
    }
    req.body.price = `N${req.body.price}`;
    const updatedProduct = (await products_model_1.default.update({ id }, { id, ...req.body }));
    redis_connect_1.default.del(`products:${id}`);
    redis_connect_1.default.setex(`products:${id}`, 36000, JSON.stringify(updatedProduct));
    res.status(200).json({
        message: `Product with id ${id} updated successfully`,
        data: {
            updatedProduct,
        },
        status: true,
    });
});
exports.deleteProductById = (0, express_async_handler_1.default)(async (req, res) => {
    const id = Number(req.params.id);
    const product = (await products_model_1.default.findOne({ id }));
    if (!product) {
        throw new bad_request_1.default("Product not found");
    }
    await products_model_1.default.remove({ id });
    redis_connect_1.default.del("products?");
    redis_connect_1.default.del(`products:${id}`);
    res.status(200).json({
        message: `Product with id ${id} deleted successfully`,
        data: {},
        status: true,
    });
});
