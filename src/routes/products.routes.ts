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
  validateProductData,
  MoveFile.awsMoveProfilePicture,
  validateFileUpload,
  Product.addProduct
);
productRouter.get("/products", Product.getProducts);
productRouter
  .route("/products/:id")
  .all(validateRequestParameter)
  .get(Product.getProductById)
  .put(validateProductData, Product.updateProductById)
  .delete(Product.deleteProductById);

export default productRouter;
