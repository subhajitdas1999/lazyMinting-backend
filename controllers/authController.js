import jsonwebtoken from "jsonwebtoken";
import User from "../model/userModel.js";
import { promisify } from "util";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

//Generate the jwt token
const getToken = (id) => {
  return jsonwebtoken.sign({ id }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendCookie = (res, token) => {
  //setting cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ), //in milliseconds
    // secure: false, //for this the cookie will only be sent in secured connection (HTTPS) and we want to activate this part only in production
    httpOnly: true, //this will make the cookie cannot be access or modified in anyway by the browser
    // SameSite: "None",
  };

  //part of hero ku deployment
  // Now in express we have a req.secure property which is true when the connection is secure
  //but on heroku this req.secure doesnot work because of heroku proxies
  //basically redirect/modifies all incoming req into our application before they actually reach the app
  //to make it work in heroku we have to check if the x-forward-proto header set to https
  //this something heroku does internally

  // if (req.secure || req.headers["x-forward-proto"] === "https")
  // cookieOptions.secure = true;

  //send the cookie
  res.cookie("jwt", token, cookieOptions);
};
const signup = catchAsync(async (req, res, next) => {
  const newUserData = { ...req.body };

  //exclude the role filed
  const excludedFields = ["role"];

  excludedFields.forEach((el) => delete newUserData[el]);

  const user = await User.create(newUserData);
  const token = getToken(user._id);

  //send cookie
  sendCookie(res, token);
  res.status(201).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

const logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError(400, "Please provide email and password"));
  }

  const user = await User.findOne({ email }).select("+password");

  // console.log(user, await user.checkPassword(password, user.password));
  //check user is present and given password is valid
  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError(400, "Provide correct email or password"));
  }

  //get the token id
  const token = getToken(user._id);

  //send cookie
  sendCookie(res, token);

  // send the response
  res.status(201).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

const logOut = catchAsync(async (req, res, next) => {
  //send cookie
  sendCookie(res, "loggedOut");
  res.status(200).json({
    status: "success",
  });

});

const isLoggedIn = catchAsync(async(req,res,next) =>{
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError(401, "You are not logged In."));
  }

  const decoded = await promisify(jsonwebtoken.verify)(
    token,
    process.env.JWT_SECRET_TOKEN
  );

  //get the user
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError(401, "Token Bearer is not exists"));
  }

  // send the response
  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });

})


//protect the route . Make sure user is logged In
const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError(401, "You are not logged In."));
  }

  

  // this jsonwebtoken verify expects a call back func as a third argument we want keep async await
  //that's why we are using promisify from node js
  //this gives us the payload
  const decoded = await promisify(jsonwebtoken.verify)(
    token,
    process.env.JWT_SECRET_TOKEN
  );

  //get the user
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError(401, "Token Bearer is not exists"));
  }
  req.user = user;
  next();
});

export { signup, logIn, logOut, protect,isLoggedIn };
