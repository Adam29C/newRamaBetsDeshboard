import jwt from "jsonwebtoken";
import { findOne, insertQuery, update } from "./../../../helpers/crudMongo.js";
import {
  HTTP_MESSAGE,
  InternalServerErrorResponse,
  SuccessResponse,
} from "./../../../helpers/http.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "./../../../config/env.config.js";

const generateAuthToken = async (req, res) => {
  try {
    const { id, deviceId, role } = req.body;
    if (!id && !deviceId) {
      // Updated to use the new response handler
      return BadRequestResponse(res, req.t("failure_message_1"));
    }
    let token;
    let query;
    if (id) {
      let details;
      if (role === "ADMIN") {
        details = await findOne("admin", { _id: id }, { roles: 1 });
      } else {
        details = await findOne("users", { _id: id }, { roles: 1 });
      }
      if (details) {
        query = { id: id };
        let rol;
        if (details.roles === "USER") {
          rol = { USER: "USER" };
        }
        if (details.roles === "ADMIN") {
          rol = { ADMIN: "ADMIN" };
        }
        let roles = Object.keys(rol);
        token = jwt.sign(
          {
            info: {
              id: id,
              roles: roles,
            },
            date: Date.now(),
          },
          JWT_SECRET,
          {
            expiresIn: JWT_EXPIRES_IN,
          }
        );
      } else {
        return BadRequestResponse(res, req.t("failure_message_2"));
      }
    }
    if (deviceId) {
      query = { deviceId: deviceId };
      let rol;
      if (role.toUpperCase() === "ADMIN") {
        rol = { ADMIN: "ADMIN" };
      } else {
        rol = { USER: "USER" };
      }
      let roles = Object.keys(rol);
      token = jwt.sign(
        {
          info: {
            deviceId: deviceId,
            roles: roles,
          },
          date: Date.now(),
        },
        JWT_SECRET,
        {
          expiresIn: JWT_EXPIRES_IN,
        }
      );
    }
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
