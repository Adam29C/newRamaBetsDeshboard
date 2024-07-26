import { deleteQuery, findAll, findOne, insertQuery, update } from '../../../../helpers/crudMongo.js';
import { HTTP_MESSAGE, InternalServerErrorResponse, SuccessResponse, BadRequestResponse, UnauthorizedResponse } from '../../../../helpers/http.js';
import Admin from '../../../../models/admin.js';
import { DeletedUser } from '../../../../models/deleteUser.js';
import { UserIdea } from '../../../../models/userIdia.js';

import { Users } from '../../../../models/users.js';



//All User List Api function 
const userList = async (req, res) => {
  try {
    const adminId = req.params.adminId;

    //check If the admin exist
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    //fatch all user list
    const list = await findAll("Users", {})
    return SuccessResponse(res, HTTP_MESSAGE.USER_LIST, list)

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

//All userInfoById Api function 
const userInfoById = async (req, res) => {
  try {
    const { adminId, userId } = req.body;

    //check If the admin exist
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    //check If the user exist
    const userDetails = await findOne("Users", { _id: userId });
    if (!userDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    return SuccessResponse(res, HTTP_MESSAGE.USER_INFO, userDetails)

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

//Function For Admin Block User api
const blockUser = async (req, res) => {
  try {
    const { adminId, userId, isBlock } = req.body;

    // Validate adminId
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    // Validate userId
    const userDetails = await findOne("Users", { _id: userId });
    if (!userDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    // Update User block status
    await update("Users", { _id: userId }, { isBlock });

    // Determine the response message
    const message = isBlock ? HTTP_MESSAGE.BLOCK_USER : HTTP_MESSAGE.UNBLOCK_USER;

    // Respond with the appropriate message
    return SuccessResponse(res, message);

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};


const deleteUser = async (req, res) => {
  try {
    let { adminId, userId, } = req.body;

    // Check if admin exists
    const adminInfo = await findOne("Admin", { _id: adminId });
    if (!adminInfo) return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);

    // Check if user exists
    const userInfo = await findOne("Users", { _id: userId });
    if (!userInfo) return BadRequestResponse(res, HTTP_MESSAGE.USER_ALREADY_DELETED);

    // Create delete user object
    const deleteUserObj = {
      userId: userInfo._id,
      name: userInfo.name,
      username: userInfo.username,
      mobile: userInfo.mobile,
      createdAt: userInfo.createdAt // Assuming `createdAt` is stored in the `userInfo`
    };

    // Insert the deleted user object into DeletedUser collection
    await insertQuery("DeletedUser", deleteUserObj);

    // Delete the user from Users collection
    await deleteQuery("Users", { _id: userId });

    return SuccessResponse(res, HTTP_MESSAGE.USER_DELETED_SUCCESS);
  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
}

//All userInfoById Api function 
const getUserIdea = async (req, res) => {
  try {
    const { adminId } = req.query;

    // Check if the admin exists
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    // Find user ideas
    const userIdeaInfo = await findAll("UserIdea", {});
    return SuccessResponse(res, HTTP_MESSAGE.USER_IDIA_INFO, userIdeaInfo);

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

const getDeleteUser =async(req,res)=>{
try{
  const {adminId}=req.query;
  
  //chack if admin exist
  const adminDetails =await ("Admin",{_id:adminId})
  if(!adminDetails) return BadRequestResponse(res,HTTP_MESSAGE.USER_NOT_FOUND)
  
  const list = await DeletedUser.find({})
  return SuccessResponse(res,HTTP_MESSAGE.ALL_DELETE_USER_HISTORY,list)
}catch(err){
  return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
}
}

export { userList, userInfoById, blockUser,deleteUser,getUserIdea,getDeleteUser }
