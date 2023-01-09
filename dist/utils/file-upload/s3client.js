"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const credential_providers_1 = require("@aws-sdk/credential-providers");
const config_1 = __importDefault(require("../config"));
const s3Client = new client_s3_1.S3Client({
    credentials: (0, credential_providers_1.fromEnv)(),
    region: config_1.default.AWS.region,
});
exports.default = s3Client;
