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
exports.addProduct = (0, express_async_handler_1.default)(async (req, res) => {
    req.body.price = `N${req.body.price}`;
    const product = (await products_model_1.default.create(req.body));
    redis_connect_1.default.del("products");
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
    redis_connect_1.default.get("products", async (error, products) => {
        if (error)
            console.error(error);
        if (products != null) {
            productsData = JSON.parse(products);
        }
        else {
            productsData = (await products_model_1.default.find());
            redis_connect_1.default.setex("products", 3600, JSON.stringify(productsData));
        }
        res.status(200).json({
            message: "All products retrieved",
            data: {
                products: productsData,
            },
            status: true,
        });
    });
});
exports.getProductById = (0, express_async_handler_1.default)(async (req, res) => {
    const product = (await products_model_1.default.findOne({
        id: Number(req.params.id),
    }));
    if (!product) {
        throw new bad_request_1.default("Product not found");
    }
    res.status(200).json({
        message: "Product retrieved",
        data: {
            product,
        },
        status: true,
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
    redis_connect_1.default.del("products");
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
    redis_connect_1.default.del("products");
    res.status(200).json({
        message: `Product with id ${id} deleted successfully`,
        data: {},
        status: true,
    });
});
