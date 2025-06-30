import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
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
    dc_id: {
      type: Number,
      default: null,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    permission: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: false,
    collection: "users",
    _id: false,
  }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema, "users");
