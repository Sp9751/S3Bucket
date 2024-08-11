import { Router, Request, Response } from "express";
import User from "../models/user.model";
import cryptoJs from "crypto-js";
import { Secret } from "../config/env.variable";
import * as Auth from "../middlewares/Auth.middleware";
import { AuthRequest } from "../utils/all.intreface";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "this email is already used" });
    }

    const apiStr = email + name + Secret;
    const apikey = cryptoJs.SHA256(apiStr).toString().slice(0, 20);

    console.log(apikey);
    user = new User({ name, email, password, apikey });
    user.save();

    res.status(200).json({ success: "User Created" });
  } catch (error) {
    console.log(error);
  }
});

router.post(
  "/login",
  Auth.userAuthMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      if (req.user) {
        res.json({ success: true, user: req.user });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export { router };
