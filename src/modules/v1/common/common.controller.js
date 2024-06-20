import jwt from "jsonwebtoken";
import { findOne, insertQuery, update } from "./../../../helpers/crudMongo.js";
import {
  HTTP_MESSAGE,
  InternalServerErrorResponse,
  SuccessResponse,
  BadRequestResponse,
} from "./../../../helpers/http.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "./../../../config/env.config.js";

const generateAuthToken = async (req, res) => {
  try {
    const { id, deviceId, role } = req.body;
    let query;
    let details;
    let token;

    if (id) {
      if (role === "ADMIN") {
        details = await findOne("admin", { _id: id }, { roles: 1 });
      } else {
        details = await findOne("users", { _id: id }, { roles: 1 });
      }
      if (!details) {
        return BadRequestResponse(res, req.t("failure_message_2"));
      }
      query = { id: id };
    }

    if (deviceId) {
      query = { deviceId: deviceId };
    }

    let rol = {};
    if (role.toUpperCase() === "ADMIN") {
      rol = { ADMIN: "ADMIN" };
    } else if (role.toUpperCase() === "SUBADMIN") {
      rol = { SUBADMIN: "SUBADMIN" };
    } else {
      rol = { USER: "USER" };
    }

    let roles = Object.keys(rol);

    token = jwt.sign(
      {
        info: {
          id: id ? id : "",
          deviceId: deviceId ? deviceId : "",
          roles: roles,
        },
        date: Date.now(),
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    let data = await findOne("tokenData", query);
    if (data) {
      await update("tokenData", { _id: data._id }, { token: token });
    } else {
      await insertQuery("tokenData", {
        token: token,
        userId: id ? id : "",
        deviceId: deviceId ? deviceId : "",
      });
    }
    return SuccessResponse(res, req.t("success_status"), { token });
  } catch (err) {
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      err
    );
  }
};

export { generateAuthToken };
