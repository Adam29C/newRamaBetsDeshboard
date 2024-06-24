import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "./../config/env.config.js";
import { findOne, insertQuery, update } from "../helpers/crudMongo.js";

const createToken = async(id, deviceId, roles,query) => {
  const token = jwt.sign(
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
  let data = await findOne("TokenData", query);
    if (data) {
      await update("TokenData", { _id: data._id }, { token: token });
    } else {
      const tokenData = {
        token: token,
        deviceId: deviceId ? deviceId : "",  
        id: id ? id : "",
      };
      await insertQuery("TokenData", tokenData);
    }
  return token;
};

export default createToken;

