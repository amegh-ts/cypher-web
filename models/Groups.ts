import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
    {
        chat_id: { type: Number, required: true, unique: true },
        title: { type: String, required: true },
        status: {
            type: String,
            enum: ["approved", "pending", "paused", "banned", "disapproved"],
            default: "pending",
        },
        invite_link: { type: String },
        is_channel: { type: Boolean, default: false },
        joined_date: { type: Date, default: Date.now },
        alert_msg_id: { type: Number },
        last_alert_time: { type: Date },
    },
    {
        timestamps: false,
        collection: "groups",
    }
);

export default mongoose.models.Group || mongoose.model("Group", GroupSchema);
