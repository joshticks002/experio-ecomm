"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productRouter = express_1.default.Router();
const Product = __importStar(require("../controllers/products.controller"));
const validate_product_data_1 = __importDefault(require("../middleware/validate-product-data"));
const validate_request_data_1 = require("../middleware/validate-request-data");
const validate_file_upload_1 = __importDefault(require("../middleware/validate-file-upload"));
const cloud_storage_1 = __importDefault(require("../utils/cloud-storage"));
const multer_1 = __importDefault(require("multer"));
const uploads = (0, multer_1.default)({ storage: cloud_storage_1.default, limits: { fileSize: 1 * 1024 * 1024 } });
productRouter.post("/products", uploads.single("file"), validate_file_upload_1.default, validate_product_data_1.default, Product.addProduct);
productRouter.get("/products", Product.getProducts);
productRouter
    .route("/product/:id")
    .all(validate_request_data_1.validateRequestParameter)
    .get(Product.getProductById)
    .put(validate_product_data_1.default, Product.updateProductById)
    .delete(Product.deleteProductById);
exports.default = productRouter;
