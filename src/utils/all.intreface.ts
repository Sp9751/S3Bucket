import { Document } from "mongoose";
import { Request } from "express";

export interface UserDoc extends Document {
  name: string;
  email: string;
  password: string;
  apikey: string;
}

export interface FileDoc extends Document {
  userId: UserDoc;
  filename: string;
  mineType: string;
  path: string;
}

export interface AuthRequest extends Request {
  user: UserDoc; // Customize this with your user type if needed
}
