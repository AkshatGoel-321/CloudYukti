// src/models/User.ts
import  { Schema, model, models } from "mongoose";

export interface IUser {
  email: string;
  password: string;
  fullName: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = models.User || model<IUser>("User", userSchema);

export default UserModel;