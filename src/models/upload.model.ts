import mongoose, { Schema } from "mongoose";
import User from "./user.model";
import { FileDoc } from "../utils/all.intreface";

const uploadSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: User },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    path: { type: String, required: true },
  },
  { timestamps: true }
);

const fileUpload = mongoose.model<FileDoc>("files", uploadSchema);

export { fileUpload };
