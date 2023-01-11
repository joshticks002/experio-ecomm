import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import Config from "../config";

const {
  CLOUDINARY: { name, key, secret, url },
} = Config;

cloudinary.config({
  cloud_name: name,
  api_key: key,
  api_secret: secret,
  cloudinary_url: url,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Scorecard",
    allowedFormats: ["png", "jpeg", "jpg", "pdf"],
  },
} as any);

export default storage;
