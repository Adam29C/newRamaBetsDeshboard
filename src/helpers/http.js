export const HTTP_MESSAGE = {
  SUCCESS: 'Success',
  BAD_REQUEST: 'Bad request',
  UNAUTHORIZED: 'Unauthorized request',
  CONFLICT: 'Conflict request',
  FORBIDDEN: 'Forbidden request',
  NOT_FOUND: 'Not found',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  CANNOT_DELETE: `This Record Can't Be Deleted, It Contains References to Other Data`,
  GATEWAY_TIMEOUT: 'Gateway timeout',
  UNKNOWN_ERROR: 'Unknown error',
  ACCOUNT_STATUS: "Account status",
  WRONG_PASSWORD: "Please Provide Correct Password",
  SUCCESSFUL_OTP: "OTP Successful",
  TOKEN_CREATED:"Token Created SuccessFully",
  ADMIN_PROFILE:"Admin Profile Show Successfully",
  PASSWORD_CHANGE:"Password Change Successfully",
  CREATED_EMPLOGEE:"New Employee Created Successfully",
  BLOCK_EMPLOYEE:"Employee Block Successfully",
  UNBLOCK_EMPLOYEE:"Employee UnBlock Successfully",
  EMP_LIST:"Employee List Show Successfully",
  LOGIN:"Login Successfully",
  ADD_SYSINFO:"System Informition Added Successfully",
  UPDATE_SYSINFO:"System Informition Updated Successfully",
  DELETE_EMPLOYEE:"Employee Delete Successfully",
  USER_NOT_FOUND:"Admin Or SubAdmin Are Not Found",
  EMPLOYEE_NOT_FOUND:"Employee Not Found",
  EMP_UPDATE:"Employee Informition Update successfully",
  GET_PERMISSION:"Get All Permissions",
  USER_LIST:"All User List Show Successfully",
  GAME_CREATED:"Game Created Sucessfully",
  GAME_PROVIDER_NOT_FOUND:"Game Provider Not Found",
  GAME_PROVIDER_DELETED:"Game Provider Deleted Successfully",
  GAME_PROVIDER_UPDATE:"Game Provider Details Update Successfully",
  PROVIDER_INFO:"Provider Informition Show Successfully",
  GAME_SETTING_CREATED:"Game Setting Created Successfully",
  GAME_SETTING_UPDATE:"Game Setting Update Successfully",
  GAME_SETTING_DELETED:"Game Setting Deleted Successfully",
  GAME_SETTING_LIST:"Game Setting List Show  Successfully",
  GAME_SETTING_NOT_FOUND:"Game Setting Not Found",
  GAME_RATE_CREATED:"Game Rate Create Successfully",
  GAME_RATE_NOT_FOUND:"Game Rate Not Found",
  GAME_RATE_UPDATE:"Game Rate Update Successfully",
  GAME_RATE_DELETED:"Game Rate Deleted Successfully",
  GAME_RATE_LIST:"Game Rate List Show Successfully",
  GAME_RATE_DETAILS:"Game Rate Details Show Successfully",
  USER_INFO:"User Info Show Successfully",
  BLOCK_USER:"User Block Successfully",
  UNBLOCK_USER:"User UnBlock Successfully",
  USER_ALREADY_DELETED:"User Not Found Or User Already Deleted",
  USER_DELETED_SUCCESS:"User Deleted Successfully",
  USER_INFO:"User Informition Show Successfully",
  USERNAME_EXIST:"UserName Already Exist",
  RESULT_NOT_DECLLARED:"Result Not Decllared",
  DIGIT_FAMILY_NOT_FOUND:"Digit family not found",
  RESULT_DECLARED_SUCCESSFULLY:"Result declared successfully",
  PROVIDER_SETTING_NOT_FOUND:"Provider Setting Not Found",
  INVALID_RESULT_DATE:"Invalid Result Date",
  GAME_RESULT_NOT_FOUND:"Game Result Not Found",
  DELETE_GAME_RESULT:"Game Result Delete Successfully",
  GAME_STATUS_UPDATED:"Game Status Update Successfully",
  GAME_DAY_ENTRY_ALLREADY_EXIST:"Game day entry already exists for this provider",
  IT_IS_NOT_RIGTH_TIME_TO_DECLARE_RESULT:"It Is Not Right Time To Declare The Result",
  GAME_RESULT_LIST_SHOW_SUCCESSFULLY:"Game Result Show Successfully",
  USER_IDIA_INFO:"All User Idea Info Show Successfully",
  ALL_DELETE_USER_HISTORY: "All Deleted User History Shown Successfully"
};

const handleResponse = (res, status, success, message, data) => {
  const response = { status, success, data, message };
  return res.status(status).json(response);
};

export const SuccessResponse = (res, message = HTTP_MESSAGE.SUCCESS, data) => {
  return handleResponse(res, 200, true, message, data);
};

export const FailedResponse = (res, message = HTTP_MESSAGE.SUCCESS, data) => {
  return handleResponse(res, 200, false, message, data);
};

export const BadRequestResponse = (res, message = HTTP_MESSAGE.BAD_REQUEST, data) => {
  return handleResponse(res, 400, false, message, data);
};

export const UnauthorizedResponse = (res, message = HTTP_MESSAGE.UNAUTHORIZED, data) => {
  return handleResponse(res, 401, false, message, data);
};

export const InvalidTokenResponse = (res, message = HTTP_MESSAGE.UNAUTHORIZED, data) => {
  return handleResponse(res, 498, false, message, data);
};

export const ConflictRequestResponse = (res, message = HTTP_MESSAGE.CONFLICT, data) => {
  return handleResponse(res, 409, false, message, data);
};

export const NotFoundResponse = (res, message = HTTP_MESSAGE.NOT_FOUND, data) => {
  return handleResponse(res, 404, false, message, data);
};

export const ForbiddenResponse = (res, message = HTTP_MESSAGE.FORBIDDEN, data) => {
  return handleResponse(res, 403, false, message, data);
};

export const InternalServerErrorResponse = (res, message = HTTP_MESSAGE.INTERNAL_SERVER_ERROR, data) => {
  return handleResponse(res, 500, false, message, data);
};

export const CannotDeleteResponse = (res, message = HTTP_MESSAGE.CANNOT_DELETE, data) => {
  return handleResponse(res, 422, false, message, data);
};

export const UnprocessableResponse = (res, message = null, data) => {
  return handleResponse(res, 422, false, message, data);
};
