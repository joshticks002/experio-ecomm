"use strict";
// import { Request, Response, NextFunction } from "express";
// import path from "path";
// import BadRequestError from "../errors/bad-request";
// const uploadProductImageLocal = async (req: Request, res: Response, next: NextFunction) => {
//     if (!req.files) {
//       throw new BadRequestError('No File Uploaded');
//     }
//     const productImage = req.files.image as any
//     if (!productImage.mimetype.startsWith('image')) {
//       throw new BadRequestError('Please Upload Image');
//     }
//     const maxSize = 1 * 1024 * 1024;
//     if (productImage.size > maxSize) {
//       throw new BadRequestError('Please upload image smaller 1MB');
//     }
//     const imagePath = path.join(
//       __dirname,
//       '../../public/uploads' + `${productImage.name}`
//     );
//     await productImage.mv(imagePath);
//     req.body.image = `/uploads/${productImage.name}`
//     next()
// };
// export default uploadProductImageLocal;
