/**
 * Moves a file to a particular location either on disk
 * or on to the cloud
 * The uploader is the file movement service.
 * It can be fs or a utility service from a cloud provider
 */
class FileMover {
  uploader: any;
  constructor(uploader: any) {
    this.uploader = uploader;
  }

  /**
   * @description uploads a file to a directory within
   * the setup or temporary directory for files
   * @param fileName Name of the file
   * @param uploadDir
   * @param fileDir
   * @returns {string} a path to the file
   */
  async uploadToDisk(fileName: string, uploadDir: string, fileDir: string) {
    const date = new Date().getDate();
    const parseName = `${date}-${fileName}`;
    this.uploader.createDirectory(fileDir);
    return await this.uploader.moveFile(parseName, uploadDir, fileDir);
  }

  /**
   * @description  Uploads a file to AWS
   * @param {String} fileName a descriptive name for the file
   * @param {Buffer} file the file stored in memory as Buffer
   * @returns
   */
  async uploadToAWS(fileName: string, file: Buffer) {
    return this.uploader.putObject(fileName, file);
  }
}

export default FileMover;
