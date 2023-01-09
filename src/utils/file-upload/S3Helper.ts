import {
  DeleteObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import s3Client from "./s3client";
import Config from "../config";

class S3Helper {
  /**
   * Adds a file to an AWS Bucket in a particular region
   * @param {String} fileName  name of the file
   * @param {Buffer} fileBody  The file as a Buffer
   * @returns {Object}
   */
  async putObject(fileName: string, fileBody: Buffer) {
    const params = {
      Bucket: Config.AWS.bucket,
      Key: fileName,
      Body: fileBody,
    };

    try {
      let data = await s3Client.send(new PutObjectCommand(params));
      return data;
    } catch (error: any) {
      console.log(error);
    }
  }

  async getObjects() {
    try {
      const bucketParams = {
        Bucket: Config.AWS.bucket,
      };
      const data = await s3Client.send(new ListObjectsCommand(bucketParams));
      console.log("Success", data);
      console.log(data.Contents);
    } catch (err) {
      console.log("Error", err);
    }
  }

  async deleteObject(key: string) {
    const params = {
      Bucket: Config.AWS.bucket,
      Key: key,
    };

    try {
      let data = await s3Client.send(new DeleteObjectCommand(params));
      console.log("Success. Object deleted.", data);
    } catch (error) {
      console.log(error);
    }
  }
}

export default new S3Helper();
