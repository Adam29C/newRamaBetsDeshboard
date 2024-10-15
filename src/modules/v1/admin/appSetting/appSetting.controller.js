import {
  findOne,
  insertQuery,
  deleteQuery,
  update,
  findAll,
} from "../../../../helpers/crudMongo.js"; //update the version setting
import bcrypt from "bcrypt";
import {
  HTTP_MESSAGE,
  InternalServerErrorResponse,
  SuccessResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} from "../../../../helpers/http.js";
import Admin from "../../../../models/admin.js";
import System from "../../../../models/system.js";
import { createToken } from "../../../../helpers/token.js";

import { Users } from "../../../../models/users.js";
import { GameProvider } from "../../../../models/gameProvider.js";
import { VersionSetting } from "../../../../models/versionSetting.js";
import { WalletContact } from "../../../../models/walledContect.js";
import { NoticeBoard } from "../../../../models/noticeBoard.js";
import { WithDrawAppMessage } from "../../../../models/withdrawMessge.js";
import { HowToPlay } from "../../../../models/howToPlay.js";
import moment from "moment";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { Notification } from "../../../../models/notification.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Update the version setting from the user
const updateVersionSetting = async (req, res) => {
  try {
    const { adminId, type, versionId, status, appVer } = req.body;
    const file = req.file;

    // Fetch Admin ID to check if it exists
    const details = await findOne("Admin", { _id: adminId });
    if (!details) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    const versionInfo = await findOne("VersionSetting", { _id: versionId });
    if (!versionInfo) {
      return BadRequestResponse(res, HTTP_MESSAGE.VERSION_SETTING_NOT_FOUND);
    }

    let query = {};

    switch (type) {
      case "1":
        query = { forceUpdate: status };
        break;
      case "2":
        query = { maintainence: status };
        break;
      case "3":
        query = { appVersion: appVer };
        if (file && file.filename) {
          query["apkFileName"] = file.filename;
        }
        break;
      default:
        return BadRequestResponse(res, "Invalid type");
    }

    if (type === "3" && file && file.filename) {
      const filePath = path.join(
        __dirname,
        "../../../../public/tempDirectory",
        file.filename
      );
      const destinationDir = path.join(__dirname, "../../../../public/apk");

      // Ensure the destination directory exists
      await fs.mkdir(destinationDir, { recursive: true });

      // Clear existing files in the destination directory
      const files = await fs.readdir(destinationDir);
      for (const existingFile of files) {
        await fs.unlink(path.join(destinationDir, existingFile));
      }

      // Move the file to the destination directory
      const destinationPath = path.join(destinationDir, file.filename);
      await fs.rename(filePath, destinationPath);
    }

    await update("VersionSetting", { _id: versionId }, { $set: query });
    return SuccessResponse(res, HTTP_MESSAGE.VERSION_SETTING_UPDATE);
  } catch (err) {
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      err
    );
  }
};

//List of version setting
const listVersionSetting = async (req, res) => {
  try {
    let { adminId } = req.query;

    //check if admin is exist
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails)
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);

    //get the all version list from the version setting table
    const list = await findAll("VersionSetting", {});
    return SuccessResponse(res, HTTP_MESSAGE.ALL_VERSION_SETTING_LIST, list);
  } catch (err) {
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      err
    );
  }
};

//Walled contect list
const walledContestList = async (req, res) => {
  try {
    let { adminId } = req.query;

    //check if admin is exist
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails)
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);

    //get the all version list from the version setting table
    const list = await findAll("WalletContact", {});
    return SuccessResponse(res, HTTP_MESSAGE.WALLED_CONTECT_LIST, list);
  } catch (err) {
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      err
    );
  }
};

//Update the Walled contect
const updateWalledContest = async (req, res) => {
  try {
    const { adminId, walledId, number, mobileNumber, headline, upiId } =
      req.body;

    // Fetch Admin ID to check if it exists
    const details = await findOne("Admin", { _id: adminId });
    if (!details) return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);

    // Use walledInfo if it exists
    const walledInfo = await findOne("WalletContact", { _id: walledId });
    if (!walledInfo)
      return BadRequestResponse(res, HTTP_MESSAGE.WALLED_CONTECT_NOT_FOUND);

    // Make the query for update
    let query = {};
    if (number) query.number = number;
    if (headline) query.headline = headline;
    if (upiId) query.upiId = upiId;
    if (mobileNumber) query.mobileNumber = mobileNumber;

    await update("WalletContact", { _id: walledId }, { $set: query });
    return SuccessResponse(res, HTTP_MESSAGE.WALLED_CONTECT_UPDATE);
  } catch (err) {
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      err
    );
  }
};

//update the notice board
const updateNoticeBoard = async (req, res) => {
  try {
    const {
      adminId,
      noticeId,
      title1,
      title2,
      title3,
      description1,
      description2,
      description3,
      contact,
    } = req.body;

    // Fetch Admin ID to check if it exists
    const details = await findOne("Admin", { _id: adminId });
    if (!details) return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);

    // Use noticeInfo if it exists
    const noticeInfo = await findOne("NoticeBoard", { _id: noticeId });
    if (!noticeInfo)
      return BadRequestResponse(res, HTTP_MESSAGE.NOTICE_BOARD_NOT_FOUND);

    // Make the query for update
    let query = {};
    if (title1) query.title1 = title1;
    if (title2) query.title2 = title2;
    if (title3) query.title3 = title3;
    if (description1) query.description1 = description1;
    if (description2) query.description2 = description2;
    if (description3) query.description3 = description3;
    if (contact) query.contact = contact;
    await update("NoticeBoard", { _id: noticeId }, { $set: query });
    return SuccessResponse(res, HTTP_MESSAGE.NOTICE_BOARD_UPDATE);
  } catch (err) {
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      err
    );
  }
};

//all notice board List
const noticeBoardList = async (req, res) => {
  try {
    let { adminId } = req.query;

    //check if admin is exist
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails)
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);

    //get the all version list from the version setting table
    const list = await findAll("NoticeBoard", {});
    return SuccessResponse(res, HTTP_MESSAGE.NOTICE_BOARD_LIST, list);
  } catch (err) {
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      err
    );
  }
};

//Update withdraw message
const updateWithdrawMessage = async (req, res) => {
  try {
    const {
      adminId,
      widhdrawMessageId,
      textMain,
      textSecondry,
      Number,
      Timing,
    } = req.body;
    // Fetch Admin ID to check if it exists
    const details = await findOne("Admin", { _id: adminId });
    if (!details) return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);

    // Use noticeInfo if it exists
    const widhdrawMessageInfo = await findOne("WithDrawAppMessage", {
      _id: widhdrawMessageId,
    });
    if (!widhdrawMessageInfo)
      return BadRequestResponse(res, HTTP_MESSAGE.WITHDRAW_MESSAGE_INFO);

    // Make the query for update
    let query = {};
    if (widhdrawMessageId) query.widhdrawMessageId = widhdrawMessageId;
    if (textMain) query.textMain = textMain;
    if (textSecondry) query.textSecondry = textSecondry;
    if (Number) query.Number = Number;
    if (Timing) query.Timing = Timing;

    await update(
      "WithDrawAppMessage",
      { _id: widhdrawMessageId },
      { $set: query }
    );
    return SuccessResponse(res, HTTP_MESSAGE.WITHDRAW_MESSAGE_UPDATE);
  } catch (err) {
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      err
    );
  }
};

//withdreaw message list
const withdrawMessageList = async (req, res) => {
  try {
    let { adminId } = req.query;

    //check if admin is exist
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails)
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);

    //get the all version list from the version setting table
    const list = await findAll("WithDrawAppMessage", {});
    return SuccessResponse(res, HTTP_MESSAGE.WITHDRAW_MESSAGE_LIST, list);
  } catch (err) {
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      err
    );
  }
};

//withdreaw message list
const htpList = async (req, res) => {
  try {
    let { adminId } = req.query;

    //check if admin is exist
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails)
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);

    //get the all version list from the version setting table
    const list = await findAll("HowToPlay", {});
    return SuccessResponse(res, HTTP_MESSAGE.HOW_TO_PLAY_LIST, list);
  } catch (err) {
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      err
    );
  }
};

const updateHTP = async (req, res) => {
  try {
    const { adminId, htpId, howtoplay } = req.body;

    // Fetch Admin ID to check if it exists
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails)
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);

    // Fetch HowToPlay document to check if it exists
    const htpInfo = await HowToPlay.findById(htpId);
    if (!htpInfo) return BadRequestResponse(res, HTTP_MESSAGE.HOW_TO_PLAY_INFO);

    for (let item of howtoplay) {
      const { _id, title, description, videoUrl } = item;

      if (_id) {
        // Check if item exists in the database
        const existingItem = htpInfo.howtoplay.id(_id);
        if (existingItem) {
          // Update existing item
          existingItem.title = title || existingItem.title;
          existingItem.description = description || existingItem.description;
          existingItem.videoUrl = videoUrl || existingItem.videoUrl;
          existingItem.modified = new Date();
        } else {
          // If _id is provided but not found, handle as an error or create new
          return BadRequestResponse(res, HTTP_MESSAGE.GIVEN_ID_NOT_FOUND);
        }
      } else {
        // Create new item
        htpInfo.howtoplay.push({
          title,
          description,
          videoUrl,
          modified: new Date(),
        });
      }
    }

    // Save the updated HowToPlay document
    await htpInfo.save();

    return SuccessResponse(res, HTTP_MESSAGE.HOW_TO_PLAY_UPDATE);
  } catch (err) {
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      err
    );
  }
};

const addNotification = async (req, res) => {
  try {
    const { adminId, userId, message } = req.body;
    const findAdmin = await Admin.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: true,
        statusCode: 400,
        message: "Admin Not Found",
      });
    }

    await Notification.insertMany({ message: message, userId });
    res.json({
      status: true,
      statusCode: 200,
      message: "Notification Add Successfully",
    });
  } catch (err) {
    return res.json({
      status: false,
      statusCode: 400,
      message: err.message,
    });
  }
};

const updateNotification = async (req, res) => {
  try {
    const { adminId, notificationId, message } = req.body;
    const findAdmin = await Admin.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: true,
        statusCode: 400,
        messase: "Admin Not Found",
      });
    }

    const findNotification = await Notification.findOne({
      _id: notificationId,
    });
    if (!findNotification) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Notification not found",
      });
    }
    await Notification.updateOne(
      { _id: notificationId },
      { $set: { message: message } }
    );
    res.json({
      status: true,
      statusCode: 200,
      message: "Notification Update Successfully",
    });
  } catch (err) {
    res.json({
      status: false,
      statusCode: 400,
      message: err.message,
    });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { adminId, notificationId } = req.body;
    const findAdmin = await Admin.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: true,
        statusCode: 400,
        messase: "Admin Not Found",
      });
    }

    const findNotification = await Notification.findOne({
      _id: notificationId,
    });
    if (!findNotification) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Notification not found",
      });
    }
    await Notification.deleteOne({ _id: notificationId });
    res.json({
      status: true,
      statusCode: 200,
      message: "Notification delete Successfully",
    });
  } catch (err) {
    res.json({
      status: false,
      statusCode: 400,
      message: err.message,
    });
  }
};

//   module.exports.notificationList = async (req, res) => {
//     try {
//       const adminId = req.query.adminId;
//       const findAdmin = await Admin.findOne({ _id: adminId });
//       if (!findAdmin) {
//         return res.json({
//           status: true,
//           statusCode: 400,
//           messase: "Admin Not Found"
//         })
//       };

//       const list = await notification.find({}, { _id: 0, __v: 0, updatedAt: 0, createdAt: 0 });

//       res.json({
//         status: true,
//         statusCode: 200,
//         message: "Notification show  Successfully",
//         data: list
//       })
//     } catch (err) {
//       res.json({
//         status: false,
//         statusCode: 400,
//         message: err.message
//       })
//     }
//   };
export {
  updateVersionSetting,
  listVersionSetting,
  updateWalledContest,
  walledContestList,
  updateNoticeBoard,
  noticeBoardList,
  updateWithdrawMessage,
  withdrawMessageList,
  htpList,
  updateHTP,
  addNotification,
  updateNotification,
  deleteNotification
};
