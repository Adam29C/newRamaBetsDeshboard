export const HTTP_MESSAGE = {
  SUCCESS: 'Success',
  BAD_REQUEST: 'Bad request',
  UNAUTHORIZED: 'Unauthorized request',
  CONFLICT: 'Conflict request',
  FORBIDDEN: 'Forbidden request',
  NOT_FOUND: 'Not found',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  CANNOT_DELETE: `This Record Can't Deleted, It Contain References to other data`,
  GATEWAY_TIMEOUT: 'Gateway timeout',
  UNKNOWN_ERROR: 'Unknown error',
  ACCOUNT_STATUS: "Account status",
  WRONG_OTP: "Enter Wrong Otp",
  SUCCESSFULL_OTP: "OTP successFull"
};

const handleResponse = (res, status, success, message, data) => {
  const response = { status: status, success: success, data: data, message: message };
  if (res) {
    return res.status(status).json(response);
  } else {
    return response;
  }
};

const SuccessResponse = (res, message = HTTP_MESSAGE.SUCCESS, data) => {
  return handleResponse(res, 200, true, message, data);
};

const FailedResponse = (res, message = HTTP_MESSAGE.SUCCESS, data) => {
  return handleResponse(res, 200, false, message, data);
};

const BadRequestResponse = (res, message = HTTP_MESSAGE.BAD_REQUEST, data) => {
  return handleResponse(res, 400, false, message, data);
};

const UnauthorizedResponse = (res, message = HTTP_MESSAGE.UNAUTHORIZED, data) => {
  return handleResponse(res, 401, false, message, data);
};

const InvalidTokenResponse = (res, message = HTTP_MESSAGE.UNAUTHORIZED, data) => {
  return handleResponse(res, 498, false, message, data);
};

const ConflictRequestResponse = (res, message = HTTP_MESSAGE.CONFLICT, data) => {
  return handleResponse(res, 409, false, message, data);
};

const NotFoundResponse = (res, message = HTTP_MESSAGE.NOT_FOUND, data) => {
  return handleResponse(res, 404, false, message, data);
};

const ForbiddenResponse = (res, message = HTTP_MESSAGE.FORBIDDEN, data) => {
  return handleResponse(res, 403, false, message, data);
};

const InternalServerErrorResponse = (res, message = HTTP_MESSAGE.INTERNAL_SERVER_ERROR, data) => {
  return handleResponse(res, 500, false, message, data);
};

const CannotDeleteResponse = (res, message = HTTP_MESSAGE.CANNOT_DELETE, data) => {
  return handleResponse(res, 422, false, message, data);
};

const UnprocessableResponse = (res, message = null, data) => {
  return handleResponse(res, 422, false, message, data);
};

export {
  SuccessResponse,
  BadRequestResponse,
  UnauthorizedResponse,
  ConflictRequestResponse,
  NotFoundResponse,
  ForbiddenResponse,
  InternalServerErrorResponse,
  CannotDeleteResponse,
  UnprocessableResponse,
  FailedResponse,
  InvalidTokenResponse
};
