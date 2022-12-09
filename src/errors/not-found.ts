const { StatusCodes } = require('http-status-codes');
import CustomAPIError from './custom-api';

class NotFoundError extends CustomAPIError {
  statusCode: number;
  message: string;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
    this.message = message
  }
}

export default NotFoundError;
