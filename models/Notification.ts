import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  adminId: { type: String, default: null },
  message: { type: String, required: true },
  url: { type: String, default: "/" },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);
