import AppError from "../utils/appError.js";

const handleValidationErrorDB = (err) => {
  //Object.values(object) -> transfers the object in array
  const message = Object.values(err.errors)
    .map((el) => el.message)
    .join(".");
  return new AppError(400, `Invalid Input Data.${message}`);
};

const handleCastErrorDB = (err) => {
  return new AppError(400, `Invalid path ${err.value}`);
};

const handleDuplicateKeyErrorDB = (err) => {
  return new AppError(
    400,
    `Duplicate key error value '${err.keyValue.email}'  try another one `
  );
};

const handleJsonWebTokenErrorDB = (err) => {
  return new AppError(401, "Invalid token.Please try again");
};

const sendErrorDev = async (err, req, res) => {
  //1 for apis
  if (req.originalUrl.startsWith("/api")) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
};

const sendErrorProd = async (err, req, res) => {
  //1 for apis
  if (req.originalUrl.startsWith("/api")) {
    //if trusted error (passing through AppError class)
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      res.status(500).json({
        status: "Error",
        message: "Something Went wrong",
      });
    }
  }
};

const globalErrorHandler = async (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = err;
    if (err._message === "User validation failed") {
      error = handleValidationErrorDB(err);
    } else if (err.code === 11000) {
      error = handleDuplicateKeyErrorDB(err);
    }
    //web token error
    else if (err.name === "JsonWebTokenError") {
      error = handleJsonWebTokenErrorDB(error);
    } else if (err.name === "CastError") {
      //cast error occurred during query with invalid mongoose id (ex : find(id:"aaaaaaaaaaaa"))
      error = handleCastErrorDB(error);
    }


    sendErrorProd(error, req, res);
  }
};

export default globalErrorHandler;
