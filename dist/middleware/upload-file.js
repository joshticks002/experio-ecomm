"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.diskStorage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const currentPath = __dirname;
const directoryName = path_1.default.dirname(currentPath);
/**
 * Manages the upload of file to disk or to memory
 */
class UploadFile {
    constructor() {
        /**
         * Multer saves the file to memory using the memory storage method
         */
        this.saveToMemory = (0, multer_1.default)({
            storage: multer_1.default.memoryStorage(),
            limits: {
                fileSize: 1 * 1024 * 1024,
            },
        });
        //Save the file to disk ( the path is that which is provided)
        this.saveToDisk = multer_1.default.diskStorage({
            destination: function (req, file, cb) {
                cb(null, path_1.default.join(directoryName, "../public"));
            },
            filename: function (req, file, cb) {
                const date = new Date().getDate();
                const fileName = `${date}-${file.originalname}`;
                cb(null, fileName);
            },
        });
    }
}
const uploader = new UploadFile();
exports.diskStorage = (0, multer_1.default)({ storage: uploader.saveToDisk });
exports.default = uploader.saveToMemory;
