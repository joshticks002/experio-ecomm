import fs from "fs";
import * as jwt from "jsonwebtoken";
import Config from "./config";

const {
  JWT: { secret, subject, issuer, expires },
} = Config;

const writeToFile = (dir: string, content: Record<string, any>) => {
  const writer = fs.createWriteStream(dir);
  writer.write(JSON.stringify(content, null, 2));
};

const generateId = (db: Record<string, any>) => {
  if (!db.length) return 1;

  const id = db[db.length - 1].id + 1;
  return id;
};

const generateToken = (data: Record<string, any>) => {
  const { id, email, fullname } = data;
  const token = jwt.sign(
    {
      id,
      email,
      fullname,
    },
    secret,
    {
      issuer: issuer,
      expiresIn: expires,
      algorithm: "HS512",
      subject: subject,
    }
  );
  return token;
};

module.exports = {
  writeToFile,
  generateId,
  generateToken,
};
