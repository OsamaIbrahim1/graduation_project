import mongoose from "mongoose";
import { systemRoles } from "../../src/utils/system-role.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phoneNumber: { type: String, required: true, minlength: 11 },
    Birthday: {
      type: Date,
      max: Date.now(),
    },
    role: {
      type: String,
      required: true,
      default: systemRoles.USER,
    },
    Image: {
      secure_url: { type: String },
      public_id: { type: String, unique: true },
    },
    folderId: { type: String, unique: true },
    passwordResetOTP: {
      code: String,
      expiresAt: Date,
    },
    userPoints: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
