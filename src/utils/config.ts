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

interface IConfig {
    serverPort: string;
    nodeEnv: string;
    JWT: IJWT;
    CLOUDINARY: ICLOUDINARY
    sendgridKey: string
    mailSender: string
}

const Config: IConfig = {
    serverPort: process.env.PORT as string,
    nodeEnv: process.env.NODE_ENV as string,
    JWT: {
        secret: process.env.JWT_SECRET as string,
        issuer: process.env.JWT_ISSUER as string,
        subject: process.env.JWT_SUBJECT as string,
        algorithm: process.env.JWT_ALGORITHM as string,
        expires: Number(process.env.JWT_EXPIRES)
    },
    CLOUDINARY: {
        name: process.env.CLOUDINARY_CLOUD_NAME as string,
        key: process.env.CLOUDINARY_API_KEY as string,
        secret: process.env.CLOUDINARY_API_SECRET as string,
        url: process.env.CLOUDINARY_URL as string,
    },
    sendgridKey: process.env.SENDGRID_API_KEY as string,
    mailSender: process.env.EMAIL_SENDER as string,
}

export default Config;