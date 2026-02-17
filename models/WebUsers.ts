import mongoose from "mongoose";

const WebUserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        name: { type: String },
        role: {
            type: String,
            enum: ["super_admin", "admin", "user"],
            default: "user",
        },
        refresh_token: { type: String },
        last_login: { type: Date },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        collection: "web_users",
    }
);

export default mongoose.models.WebUser ||
    mongoose.model("WebUser", WebUserSchema);
