const { StatusCodes } = require("http-status-codes");
import CustomAPIError from "./custom-api";

class ApplicationError extends CustomAPIError {
  statusCode: number;
  message: string;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    this.message = message;
  }
}

export default ApplicationError;
