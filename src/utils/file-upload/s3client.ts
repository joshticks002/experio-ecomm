import { S3Client } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";
import Config from "../config";

const s3Client = new S3Client({
  credentials: fromEnv(),
  region: Config.AWS.region,
});

export default s3Client;
