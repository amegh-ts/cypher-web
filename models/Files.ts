import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    _id: { type: Number, required: true },
    file_link: { type: String, required: true },
    file_name: { type: String, required: true },
    file_size: { type: Number, required: true },
    file_type: { type: String, required: true },
  },
  {
    timestamps: false,
    collection: "files",
    _id: false,
  }
);

export default mongoose.models.File ||
  mongoose.model("File", FileSchema, "files");
