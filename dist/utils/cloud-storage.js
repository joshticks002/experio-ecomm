"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const config_1 = __importDefault(require("./config"));
const { CLOUDINARY: { name, key, secret, url }, } = config_1.default;
cloudinary_1.v2.config({
    cloud_name: name,
    api_key: key,
    api_secret: secret,
    cloudinary_url: url,
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: "Scorecard",
        allowedFormats: ["png", "jpeg", "jpg", "pdf"],
    },
});
exports.default = storage;
