import FileMover from "../utils/file-upload/Filemover";
import { Request, Response, NextFunction } from "express";
import BadRequestError from "../errors/bad-request";
import ApplicationError from "../errors/application-error";
import S3Helper from "../utils/file-upload/S3Helper";
import Config from "../utils/config";
import * as path from "path";

const fileService = new FileMover(S3Helper);

class MoveFile {
  /**
   * @description
   * Moves a file from one location to another on the disk
   * @param req
   * @param res
   * @param next
   * @returns
   * Attaches the file path to the request body
   */
  static async diskMove(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.file) {
        const avatarName = req.file.originalname;
        const uploadPath = "../../public";
        const todosAvatarPath = "../../public/temp";
        const getFilePath = await fileService.uploadToDisk(
          avatarName,
          uploadPath,
          todosAvatarPath
        );
        req.body.avatarUrl = getFilePath;
        next();
      }
    } catch (error: any) {
      return next(new ApplicationError(error.message));
    }
  }

  static async awsMove(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.file) {
        const { originalname, buffer } = req.file;

        req.body.todo_avatar = await fileService.uploadToAWS(
          originalname,
          buffer
        );

        if (req.body.todo_avatar.$metadata.httpStatusCode === 200) {
          req.body.imageUrl = `https://${Config.AWS.bucket}.s3.amazonaws.com/${originalname}`;
          return next();
        }
        throw new BadRequestError("An Error occured while uploading");
      } else {
        next();
      }
    } catch (error: any) {
      throw new ApplicationError(error.message);
    }
  }

  static async awsMoveProfilePicture(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (req.file) {
        const { originalname, buffer } = req.file;

        const allowedExtensions = [".jpg", ".jpeg", ".png"];
        const fileExtension = path.extname(originalname);

        if (!allowedExtensions.includes(fileExtension)) {
          throw new BadRequestError(
            "Please,upload a a .jpg, .png, or .jpeg image"
          );
        }

        req.body.todo_avatar = await fileService.uploadToAWS(
          originalname,
          buffer
        );

        if (req.body.todo_avatar.$metadata.httpStatusCode === 200) {
          req.body.imageUrl = `https://${Config.AWS.bucket}.s3.amazonaws.com/${originalname}`;
          return next();
        }
        throw new BadRequestError("An Error occured while uploading");
      } else {
        next();
      }
    } catch (error: any) {
      throw new ApplicationError(error.message);
    }
  }
}

export default MoveFile;
