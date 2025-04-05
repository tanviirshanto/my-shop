

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin","manager","employee","viewer"], 
      default: "viewer",
    },
  },
  {
    timestamps: true, 
  }
);


const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
