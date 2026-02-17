import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        _id: { type: Number, required: true }, // Telegram User ID
        first_name: { type: String, required: true },
        last_name: { type: String },
        username: { type: String },
        dc_id: { type: Number },
        date: { type: String }, // DD-MM-YYYY
        time: { type: String }, // HH:MM:SS
        permission: { type: Boolean, default: true },
    },
    {
        timestamps: false,
        collection: "users",
        _id: false, // _id is manually set
    }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
