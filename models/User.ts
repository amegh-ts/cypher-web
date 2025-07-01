import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "owner"],
      default: "user",
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: false,
    collection: "admins",
    _id: false,
  }
);

export default mongoose.models.Admin ||
  mongoose.model("Admin", AdminSchema, "admins");
