"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const currentPath = __dirname;
const directoryName = path_1.default.dirname(currentPath);
class DiskStorageHelper {
    static async moveFile(fileName, oldPath, newPath) {
        try {
            const oldLocation = `${oldPath}/${fileName}`;
            const newLocation = `${newPath}/${fileName}`;
            await fs_1.promises.rename(path_1.default.join(directoryName, oldLocation), path_1.default.join(directoryName, newLocation));
            return path_1.default.join(directoryName, newLocation);
        }
        catch (error) {
            return error;
        }
    }
    static async createDirectory(name) {
        try {
            await fs_1.promises.mkdir(path_1.default.join(directoryName, name));
        }
        catch (error) {
            return error;
        }
    }
    static async deleteFile(fileLocation) {
        try {
            await fs_1.promises.unlink(fileLocation);
        }
        catch (error) {
            return error;
        }
    }
}
exports.default = DiskStorageHelper;
