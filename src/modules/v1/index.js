import express from "express";
// import { adminRouter } from "./admin/index.js";
// import { basicInfoRouter } from "./basicInfo/basicInfo.routes.js";
// import { contactRouter } from "./contact/contact.routes.js";
// import { homeRouter } from "./home/home.routes.js";
// import { leadServicesRouter } from "./leadServices/leadServices.routes.js";
// import { notificationRouter } from "./notification/notification.routes.js";
// import { offersRouter } from "./offers/offers.routes.js";
import { authRouter } from "./userAuth/auth.routes.js";
// import { userMediaRouter } from "./userMedia/userMedia.routes.js";
// import { userProfileRouter } from "./userProfile/userProfile.routes.js";
import { commonRouter } from "./common/common.routes.js";
// import { userIncomeRouter } from "./userIncome/userIncome.routes.js";

const versionOneRouter = express.Router();

// versionOneRouter.use("/admin", adminRouter);
// versionOneRouter.use("/basic-info", basicInfoRouter);
versionOneRouter.use("/common", commonRouter);
// versionOneRouter.use("/contact", contactRouter);
// versionOneRouter.use("/home", homeRouter);
// versionOneRouter.use("/lead-services", leadServicesRouter);
// versionOneRouter.use("/notification", notificationRouter);
// versionOneRouter.use("/offers", offersRouter);
versionOneRouter.use("/auth", authRouter);
// versionOneRouter.use("/media", userMediaRouter);
// versionOneRouter.use("/user-profile", userProfileRouter);
// versionOneRouter.use("/user-income", userIncomeRouter);

export { versionOneRouter };