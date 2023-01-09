"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const s3client_1 = __importDefault(require("./s3client"));
const config_1 = __importDefault(require("../config"));
class S3Helper {
    /**
     * Adds a file to an AWS Bucket in a particular region
     * @param {String} fileName  name of the file
     * @param {Buffer} fileBody  The file as a Buffer
     * @returns {Object}
     */
    async putObject(fileName, fileBody) {
        const params = {
            Bucket: config_1.default.AWS.bucket,
            Key: fileName,
            Body: fileBody,
        };
        try {
            let data = await s3client_1.default.send(new client_s3_1.PutObjectCommand(params));
            return data;
        }
        catch (error) {
            console.log(error);
        }
    }
    async getObjects() {
        try {
            const bucketParams = {
                Bucket: config_1.default.AWS.bucket,
            };
            const data = await s3client_1.default.send(new client_s3_1.ListObjectsCommand(bucketParams));
            console.log("Success", data);
            console.log(data.Contents);
        }
        catch (err) {
            console.log("Error", err);
        }
    }
    async deleteObject(key) {
        const params = {
            Bucket: config_1.default.AWS.bucket,
            Key: key,
        };
        try {
            let data = await s3client_1.default.send(new client_s3_1.DeleteObjectCommand(params));
            console.log("Success. Object deleted.", data);
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.default = new S3Helper();
