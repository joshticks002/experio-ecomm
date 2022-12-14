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
const move_file_1 = __importDefault(require("../middleware/move-file"));
const upload_file_1 = __importDefault(require("../middleware/upload-file"));
const validate_file_upload_1 = __importDefault(require("../middleware/validate-file-upload"));
productRouter.post("/products", upload_file_1.default.single("file"), validate_product_data_1.default, move_file_1.default.awsMoveProfilePicture, validate_file_upload_1.default, Product.addProduct);
productRouter.get("/products", Product.getProducts);
productRouter
    .route("/products/:id")
    .all(validate_request_data_1.validateRequestParameter)
    .get(Product.getProductById)
    .put(validate_product_data_1.default, Product.updateProductById)
    .delete(Product.deleteProductById);
exports.default = productRouter;
