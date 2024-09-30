import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true 
  },
  userId:{
    type: String
  }
}, {
  timestamps: true 
});

const Notification = mongoose.model("Notification", notificationSchema);
export{Notification}