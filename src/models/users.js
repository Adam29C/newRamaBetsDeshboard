import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const currentMonthAndYearInString = () => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const today = new Date();
  const formattedDate = `${
    monthNames[today.getMonth()]
  } ${today.getFullYear()}`;
  return formattedDate;
};

const MobileNumberValidator = {
  value: {
    type: Number,
  },
  verified: {
    type: Boolean,
    trim: true,
  },
  otp: { type: Number, select: false },
};

const UserDocsData = {
  aadharCard: {
    type: String,
    // required: true,
  },
  panCard: {
    type: String,
    // required: true,
  },
  photo: {
    type: String,
    // required: true,
  },
};

const common = {
  value: {
    type: String,
  },
  listNumber: {
    type: Number,
  },
};

const generalDetailSchema = new Schema({
  occupation: [common],
  qualification: [common],
  annualIncome: [common],
});

const BookmarkedUserMedia = {
  shortVideos: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'shortVideos'
  },
  mediaDocuments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'mediaDocuments'
  },
};
let bankDetailSchema = new Schema({
  bankName:{
    type:String,
  },
  branchName:{
    type:String,
  },
  accountNumber:{
    type:Number,
  },
  holderName:{
    type:String,
  },
  ifscCode:{
    type:String,
  },
  upiId:{
    type:String,
  },
  chequeImage:{
    type:String,
  }
});
const User = new Schema(
  {
    emailId: {
      type: String,
      trim: true,
    },
    name:{
      typr:String,
    },
    mobileNumber: MobileNumberValidator,
    roles: {
      type: String,
      default: "USER",
    },
    countrycode: {
      type: String,
    },
    fcmToken: {
      type: String,
    },
    status: {
      type: String,
      enum:["pending","active","deactived"],
      default:"pending",
    },
    loginStatus: {
      type: String,
      enum: ["loggedIn", "loggedOut"],
    },
    appInstalledStatus: {
      type: String,
    },
    memberSince: { type: String, default: currentMonthAndYearInString() },
    gstNumber: {
      type: String,
    },
    occupation: {
      type: String,
    },
    qualification: {
      type: String,
    },
    annualIncome: {
      type: String,
    },
    pinCode: {
      type: String,
    },
    dob: {
      type: Date,
    },
    bankDetails:{
      type: bankDetailSchema,
    },
    userDocs: UserDocsData,
    bookmarkedUserMedia: BookmarkedUserMedia,
  },
  {
    collection: "users",
  },
  {
    timestamps: true
  }
);

User.methods.correctPassword = async function (clientPassword, savedPassword) {
  return await bcrypt.compare(clientPassword, savedPassword);
};

User.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.pinChangedAt) {
    const changedTimestamp = parseInt(this.pinChangedAt.getTime() / 1000, 10);

    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const UserBasicInfo = mongoose.model("userBasicInfo", generalDetailSchema);
const Users = mongoose.model("users", User);

export { Users, UserBasicInfo };
