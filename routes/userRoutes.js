import express from "express";
import {
  signup,
  logIn,
  logOut,
  protect,
  isLoggedIn
} from "../controllers/authController.js";

import { becomeMinter } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/isLoggedIn", isLoggedIn);
userRouter.post("/signup", signup);
userRouter.post("/login", logIn);
userRouter.post("/logout", logOut);

userRouter.post("/minter", protect, becomeMinter);

export default userRouter;
