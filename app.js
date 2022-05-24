import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import nftRouter from "./routes/nftRoutes.js";
import globalErrorHandler from "./controllers/globalErrorHandler.js";
import AppError from "./utils/appError.js";

import dotenv from "dotenv";
dotenv.config({path:"./.env"})

const app = express();

app.use(express.json());
//in order to parse data submitted through form
app.use(express.urlencoded({ extended: true }));
//for handling files in req.files
app.use(fileUpload());

//parses the data from cookie
app.use(cookieParser())


// var corsOptions = {
//   origin: "http://localhost:3000",
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
// app.use(cors())

//handling cors
app.use(function(req, res, next) {
  
  res.header('Access-Control-Allow-Origin', process.env.ALLOW_ACCESS_TO)
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});





app.use("/api/users", userRouter);
app.use("/api/nft", nftRouter);

//if no route hit till this point
//then user has hit a wrong end point
app.all("*", (req, res, next) => {
  next(new AppError(404, "Page Not Found"));
});

//global error handler
app.use(globalErrorHandler);

export default app;
