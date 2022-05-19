import express from "express";
import fileUpload from "express-fileupload";
import userRouter from "./routes/userRoutes.js";
import nftRouter from "./routes/nftRoutes.js";
import globalErrorHandler from "./controllers/globalErrorHandler.js";
import AppError from "./utils/appError.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

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
