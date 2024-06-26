import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "./../config/env.config.js";
import { findOne, update,insertQuery } from "../helpers/crudMongo.js";
import { TokenData } from "../models/token.js";
import admin from "../models/admin.js";

// Middleware to verify the token
const verifyToken = async (req, res, next) => {
  try {

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      if (!decoded) {
        return res.status(400).send({
          statusCode: 400,
          status: "Failure",
          msg: "Token Expired or Invalid",
        });
      }
      if (decoded.info.id !== "") {
        let details = await admin.findOne({ _id: decoded.info.id });

        if (!details) {
          return res.status(400).send({
            statusCode: 400,
            status: "Failure",
            msg: "User Not Found",
          });
        }

        await admin.findOneAndUpdate(
          { _id: decoded.info.id },
          { ipAddress: req.connection.remoteAddress }
        );
        if (details.role !== 0) {
          let data = await TokenData.findOne({
            token: token,
            id: decoded.info.id,
          });
          if (!data) {
            return res.status(401).send({
              statusCode: 401,
              status: "Failure",
              msg: "Token Not Found In Database",
            });
          }
        }
        req.decoded = decoded;
      } else {
        let data = await TokenData.findOne({
          token: token,
          deviceId: decoded.info.deviceId,
        });
        if (!data) {
          return res.status(401).send({
            statusCode: 401,
            status: "Failure",
            msg: "Token Not Found In Database",
          });
        }
        req.decoded = decoded;
      }
      next();
    } else {
      return res.status(400).send({
        statusCode: 400,
        status: "Failure",
        msg: "Authorization header with Bearer token required",
      });
    }
  } catch (error) {
    return res.status(500).send({
      statusCode: 500,
      status: "Failure",
      msg: "Internal Server Error",
    });
  }
};

// Function to create a new token
const createToken = async (id, deviceId, roles, query) => {
  const token = jwt.sign(
    {
      info: {
        id: id || "",
        deviceId: deviceId || "",
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
      deviceId: deviceId || "",
      id: id || "",
    };
    await insertQuery("TokenData", tokenData);
  }

  return token;
};

export { createToken, verifyToken };
