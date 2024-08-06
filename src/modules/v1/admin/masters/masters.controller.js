
import { findAll, findOne, insertQuery, update } from "../../../../helpers/crudMongo.js";
import { BadRequestResponse, HTTP_MESSAGE, InternalServerErrorResponse, SuccessResponse } from "../../../../helpers/http.js"
import Admin from "../../../../models/admin.js";
import { UpiList } from "../../../../models/upiList.js";

const upiList = async (req, res) => {
    try {
        const { adminId, } = req.query;
        const adminDetails = await findOne("Admin", { _id: adminId });
        if (!adminDetails) return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);

        const list = await findAll("UpiList", {})
        return SuccessResponse(res, HTTP_MESSAGE.UPI_LIST_SHOW_SUCCESSFULLY, list)
    } catch (err) {
        return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err)
    }
};

const addUpi = async (req, res) => {
    try {
        const { adminId, upiName } = req.body;

        const adminDetails = await findOne("Admin", { _id: adminId });
        if (!adminDetails) return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);

        const upiObj = {
            upiName: upiName,
        };
        await insertQuery("UpiList", upiObj)
        return SuccessResponse(res, HTTP_MESSAGE.UPI_ADDED_SUCCESSFULLY)

    } catch (err) {
        return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err)
    }
};

const updateUpiStatus = async (req, res) => {
    try {
        const { adminId, upiId, status } = req.body;

        const adminDetails = await findOne("Admin", { _id: adminId });
        if (!adminDetails) return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);

        const upiDetails = await findOne("UpiList", { _id: upiId });
        if (!upiDetails) return BadRequestResponse(res, HTTP_MESSAGE.UPI_ID_NOT_FOUND);

        const activeAllRedyExist = await findAll("UpiList", { status: "true" });
        if (activeAllRedyExist.length > 0) {
            return BadRequestResponse(res, HTTP_MESSAGE.UPI_ID_AlREADY_ACTIVE);
        }

        const updateObj = {
            status: status,
        };

        await update("UpiList", { _id: upiId }, updateObj)
        return SuccessResponse(res, HTTP_MESSAGE.UPI_STATUS_UPDATE_SUCCESSFULLY)

    } catch (err) {
        return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err)
    }
};

const deleteUpi = async (req, res) => {
    try {
        const { adminId, upiId } = req.body;

        const adminDetails = await findOne("Admin", { _id: adminId });
        if (!adminDetails) return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);

        const upiDetails = await findOne("UpiList", { _id: upiId });
        if (!upiDetails) return BadRequestResponse(res, HTTP_MESSAGE.UPI_ID_NOT_FOUND);


        await UpiList.deleteOne({ _id: upiId })
        return SuccessResponse(res, HTTP_MESSAGE.UPI_ID_DELETE_SUCCESSFULLY)

    } catch (err) {
        return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err)
    }
};

export { upiList, addUpi, updateUpiStatus, deleteUpi }