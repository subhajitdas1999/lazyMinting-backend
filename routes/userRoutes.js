import express from "express";
import {
  signup,
  logIn,
  logOut,
  protect,
} from "../controllers/authController.js";

import { becomeMinter } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", logIn);
userRouter.post("/logout", logOut);

userRouter.post("/minter", protect, becomeMinter);

export default userRouter;
