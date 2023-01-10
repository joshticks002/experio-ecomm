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
const Filemover_1 = __importDefault(require("../utils/file-upload/Filemover"));
const bad_request_1 = __importDefault(require("../errors/bad-request"));
const application_error_1 = __importDefault(require("../errors/application-error"));
const S3Helper_1 = __importDefault(require("../utils/file-upload/S3Helper"));
const config_1 = __importDefault(require("../utils/config"));
const path = __importStar(require("path"));
const fileService = new Filemover_1.default(S3Helper_1.default);
class MoveFile {
    /**
     * @description
     * Moves a file from one location to another on the disk
     * @param req
     * @param res
     * @param next
     * @returns
     * Attaches the file path to the request body
     */
    static async diskMove(req, res, next) {
        try {
            if (req.file) {
                const avatarName = req.file.originalname;
                const uploadPath = "../../public";
                const todosAvatarPath = "../../public/temp";
                const getFilePath = await fileService.uploadToDisk(avatarName, uploadPath, todosAvatarPath);
                req.body.avatarUrl = getFilePath;
                next();
            }
        }
        catch (error) {
            return next(new application_error_1.default(error.message));
        }
    }
    static async awsMove(req, res, next) {
        try {
            if (req.file) {
                const { originalname, buffer } = req.file;
                req.body.todo_avatar = await fileService.uploadToAWS(originalname, buffer);
                if (req.body.todo_avatar.$metadata.httpStatusCode === 200) {
                    req.body.imageUrl = `https://${config_1.default.AWS.bucket}.s3.amazonaws.com/${originalname}`;
                    delete req.body.todo_avatar;
                    return next();
                }
                throw new bad_request_1.default("An Error occured while uploading");
            }
            else {
                next();
            }
        }
        catch (error) {
            throw new application_error_1.default(error.message);
        }
    }
    static async awsMoveProfilePicture(req, res, next) {
        try {
            if (req.file) {
                const { originalname, buffer } = req.file;
                const allowedExtensions = [".jpg", ".jpeg", ".png"];
                const fileExtension = path.extname(originalname);
                if (!allowedExtensions.includes(fileExtension)) {
                    throw new bad_request_1.default("Please,upload a a .jpg, .png, or .jpeg image");
                }
                req.body.todo_avatar = await fileService.uploadToAWS(originalname, buffer);
                if (req.body.todo_avatar.$metadata.httpStatusCode === 200) {
                    req.body.imageUrl = `https://${config_1.default.AWS.bucket}.s3.amazonaws.com/${originalname}`;
                    delete req.body.todo_avatar;
                    return next();
                }
                throw new bad_request_1.default("An Error occured while uploading");
            }
            else {
                next();
            }
        }
        catch (error) {
            throw new application_error_1.default(error.message);
        }
    }
}
exports.default = MoveFile;
