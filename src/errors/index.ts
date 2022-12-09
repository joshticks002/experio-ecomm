import CustomAPIError from './custom-api'
import UnauthenticatedError from './unauthenticated'
import NotFoundError from './not-found'
import BadRequestError from './bad-request'

const errors = {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
}

export default errors;