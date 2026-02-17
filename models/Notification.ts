import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
    {
        user_id: { type: String, required: true }, // WebUser ID or Bot User ID
        type: { type: String, required: true }, // e.g., 'system', 'alert', 'info'
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
        created_at: { type: Date, default: Date.now },
    },
    {
        timestamps: false,
        collection: "notifications",
    }
);

export default mongoose.models.Notification ||
    mongoose.model("Notification", NotificationSchema);
