import express from "express";
const productRouter = express.Router();
import * as Product from "../controllers/products.controller";
import validateProductData from "../middleware/validate-product-data";
import { validateRequestParameter } from "../middleware/validate-request-data";
import MoveFile from "../middleware/move-file";
import multerMemory from "../middleware/upload-file";
import validateFileUpload from "../middleware/validate-file-upload";
import validateAdmin from "../middleware/admin-auth";

productRouter.post(
  "/products",
  validateAdmin,
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
  .put(validateAdmin, validateProductData, Product.updateProductById)
  .delete(validateAdmin, Product.deleteProductById);

export default productRouter;
