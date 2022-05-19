import catchAsync from "../utils/catchAsync.js";

//this is a protected route that's why bwe are getting acceded to req.user
const becomeMinter = catchAsync(async (req, res, next) => {
  const user = req.user;
  //set role from user to minter
  user.role = "minter";

  await user.save();

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

export { becomeMinter };
