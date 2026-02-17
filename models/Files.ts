import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true }, // File Unique ID
        file_name: { type: String, required: true, index: "text" },
        file_link: { type: String, required: true },
        file_size: { type: Number },
        file_type: { type: String },
        quality: { type: String },
        language: { type: String },
        year: { type: String },
        created_at: { type: Date, default: Date.now },
    },
    {
        timestamps: false,
        collection: "files",
        _id: false,
    }
);

export default mongoose.models.File || mongoose.model("File", FileSchema);
