import express, { Request, Response, NextFunction } from "express";
const productRouter = express.Router();
import * as Product from "../controllers/products.controller";
import validateProductData from "../middleware/validate-product-data";
import { validateRequestParameter } from "../middleware/validate-request-data";
import validateFileUpload from "../middleware/validate-file-upload";
import storage from "../utils/cloud-storage";
import multer from "multer";
const uploads = multer({ storage, limits: { fileSize: 1 * 1024 * 1024 } });

productRouter.post(
  "/products",
  uploads.single("file"),
  validateFileUpload,
  validateProductData,
  Product.addProduct
);
productRouter.get("/products", Product.getProducts);
productRouter
  .route("/product/:id")
  .all(validateRequestParameter)
  .get(Product.getProductById)
  .put(validateProductData, Product.updateProductById)
  .delete(Product.deleteProductById);

export default productRouter;
