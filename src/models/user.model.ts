import mongoose, { Schema } from "mongoose";
import { UserDoc } from "../utils/all.intreface";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    apikey: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<UserDoc>("user", userSchema);
export default User;
