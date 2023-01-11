import * as dotenv from "dotenv";
dotenv.config();

interface IJWT {
  secret: string;
  issuer: string;
  expires: number;
  subject: string;
  algorithm: string;
}

interface ICLOUDINARY {
  name: string;
  key: string;
  secret: string;
  url: string;
}

interface IAWS {
  accessKeyId: string;
  bucket: string;
  region: string;
  secretAccessKey: string;
}

interface IConfig {
  serverPort: string;
  nodeEnv: string;
  JWT: IJWT;
  CLOUDINARY: ICLOUDINARY;
  sendgridKey: string;
  mailSender: string;
  AWS: IAWS;
  redis: {
    port: number;
    host: string;
    localPort: number;
    password: string;
  };
}

const Config: IConfig = {
  serverPort: process.env.PORT as string,
  nodeEnv: process.env.NODE_ENV as string,
  JWT: {
    secret: process.env.JWT_SECRET as string,
    issuer: process.env.JWT_ISSUER as string,
    subject: process.env.JWT_SUBJECT as string,
    algorithm: process.env.JWT_ALGORITHM as string,
    expires: Number(process.env.JWT_EXPIRES),
  },
  CLOUDINARY: {
    name: process.env.CLOUDINARY_CLOUD_NAME as string,
    key: process.env.CLOUDINARY_API_KEY as string,
    secret: process.env.CLOUDINARY_API_SECRET as string,
    url: process.env.CLOUDINARY_URL as string,
  },
  sendgridKey: process.env.SENDGRID_API_KEY as string,
  mailSender: process.env.EMAIL_SENDER as string,
  AWS: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    bucket: process.env.AWS_BUCKET as string,
    region: process.env.AWS_REGION as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
  redis: {
    host: process.env.REDIS_HOST as string,
    port: Number(process.env.REDIS_PORT) as number,
    localPort: Number(process.env.REDIS_LOCAL_PORT) as number,
    password: process.env.REDIS_PASSWORD as string,
  },
};

export default Config;
