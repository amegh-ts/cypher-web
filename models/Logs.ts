import mongoose from "mongoose";

const LogSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            enum: ["USER_ACTION", "GROUP_ACTION", "BOT_ACTION", "ADMIN_ACTION"],
        },
        user_id: { type: Number, required: true },
        meta: { type: mongoose.Schema.Types.Mixed },
        timestamp: { type: Date, default: Date.now },
        date: { type: String },
        time: { type: String },
    },
    {
        timestamps: false,
        collection: "logs",
    }
);

export default mongoose.models.Log || mongoose.model("Log", LogSchema);
