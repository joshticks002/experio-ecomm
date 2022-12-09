const { StatusCodes } = require('http-status-codes');
import CustomAPIError from './custom-api';

class BadRequestError extends CustomAPIError {
  statusCode: number;
  message: string;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.message = message
  }
}

export default BadRequestError;
