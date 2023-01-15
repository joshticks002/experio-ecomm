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
    const lastPage = count / 10 >= 1 ? Math.ceil(count / 10) : 1;
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
                total_products: totalCount,
                page: queryPage ? Number(queryPage) : 1,
                per_page: 10,
                total_pages: totalCount > 10 ? Math.ceil(totalCount / 10) : 1,
                products: productsData,
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
const seedProducts = (0, express_async_handler_1.default)(async (req, res) => {
    const name = [
        "Spike lon",
        "Zara sui",
        "Zamani",
        "Cleaver Burke",
        "G-feather",
        "OP-frendy",
        "Booster",
        "Shark tack",
        "Fenilsy",
        "Booutr",
        "Turtle lovers",
        "Acaton",
        "Berinweed",
        "Whale boy",
        "Snakylu",
    ];
    const brand = [
        "Gucci",
        "Nike",
        "Targets",
        "Vans",
        "Nintendo",
        "Gloseir",
        "CHANEL",
        "Uniqlo",
        "crocs",
        "Adidas",
        "Tiffany & Co",
        "PUMA",
    ];
    const image = [
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c3VpdHN8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1622745473872-9ab4f498d88a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGZlbWFsZSUyMGdvd25zfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8c3Bpa2UlMjBzaG9lc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
    ];
    const rating = 5;
    const reviews = 500;
    const price = 400000;
    const quantity = 50;
    const category = ["Shoes", "Wears"];
    const description = [
        "Best money can afford",
        "Very nice and comfortable",
        "Spice your daily look",
        "Fashion at its peak",
        "We got you covered",
        "High quality product",
        "All to your beauty",
    ];
    const storage = [];
    for (let i = 1; i <= 10000; i++) {
        const randomName = name[Math.floor(Math.random() * 15)];
        const randomBrand = brand[Math.floor(Math.random() * 12)];
        const randomImage = image[Math.floor(Math.random() * 3)];
        const randomDesc = description[Math.floor(Math.random() * 7)];
        const randomCategory = category[Math.floor(Math.random() * 2)];
        const randRating = Math.floor(Math.random() * rating);
        const randReviews = Math.floor(Math.random() * reviews);
        const randPrice = Math.floor(Math.random() * price);
        const randQuantity = Math.floor(Math.random() * quantity);
        const item = {
            id: i,
            name: randomName,
            image: randomImage,
            category: randomCategory,
            brand: randomBrand,
            description: randomDesc,
            price: `N${randPrice}`,
            countInStock: randQuantity,
            rating: randRating,
            numReviews: randReviews,
        };
        storage.push(item);
    }
    await products_model_1.default.create(storage);
    res.status(201).json({
        message: "Product seeding Completed",
        data: [],
        statusCode: 201,
    });
});
