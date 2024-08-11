import User from "../models/user.model";
import { Request, Response, NextFunction } from "express";
import { AuthRequest, UserDoc } from "../utils/all.intreface";

const userAuthMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const apikey = req.query.apikey;

    if (!apikey) {
      return res.status(400).json({ error: "user unauthorised" });
    }

    const user = await User.findOne({ apikey: apikey });

    if (!user) {
      return res.status(200).json({ error: "user unauthorised" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
  }
};

export { userAuthMiddleware };
