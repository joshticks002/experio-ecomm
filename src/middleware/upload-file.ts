import multer from "multer";
import path from "path";

const currentPath = __dirname;
const directoryName = path.dirname(currentPath);

/**
 * Manages the upload of file to disk or to memory
 */

class UploadFile {
  /**
   * Multer saves the file to memory using the memory storage method
   */
  saveToMemory = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 0.5 * 1024 * 1024,
    },
  });

  //Save the file to disk ( the path is that which is provided)
  saveToDisk = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(directoryName, "../public"));
    },
    filename: function (req, file, cb) {
      const date = new Date().getDate();
      const fileName = `${date}-${file.originalname}`;
      cb(null, fileName);
    },
  });
}

const uploader = new UploadFile();

export const diskStorage = multer({ storage: uploader.saveToDisk });
export default uploader.saveToMemory;
