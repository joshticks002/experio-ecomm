const { StatusCodes } = require('http-status-codes');
import CustomAPIError from './custom-api';

class UnauthenticatedError extends CustomAPIError {
  statusCode: number;
  message: string;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
    this.message = message
  }
}

export default UnauthenticatedError;
