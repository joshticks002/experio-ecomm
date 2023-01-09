import express from "express";
const productRouter = express.Router();
import * as Product from "../controllers/products.controller";
import validateProductData from "../middleware/validate-product-data";
import { validateRequestParameter } from "../middleware/validate-request-data";
import MoveFile from "../middleware/move-file";
import multerMemory from "../middleware/upload-file";
import validateFileUpload from "../middleware/validate-file-upload";

productRouter.post(
  "/products",
  multerMemory.single("file"),
  MoveFile.awsMove,
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
