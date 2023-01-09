"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Moves a file to a particular location either on disk
 * or on to the cloud
 * The uploader is the file movement service.
 * It can be fs or a utility service from a cloud provider
 */
class FileMover {
    constructor(uploader) {
        this.uploader = uploader;
    }
    /**
     * @description uploads a file to a directory within
     * the setup or temporary directory for files
     * @param fileName Name of the file
     * @param uploadDir
     * @param fileDir
     * @returns {string} a path to the file
     */
    async uploadToDisk(fileName, uploadDir, fileDir) {
        const date = new Date().getDate();
        const parseName = `${date}-${fileName}`;
        this.uploader.createDirectory(fileDir);
        return await this.uploader.moveFile(parseName, uploadDir, fileDir);
    }
    /**
     * @description  Uploads a file to AWS
     * @param {String} fileName a descriptive name for the file
     * @param {Buffer} file the file stored in memory as Buffer
     * @returns
     */
    async uploadToAWS(fileName, file) {
        return this.uploader.putObject(fileName, file);
    }
}
exports.default = FileMover;
