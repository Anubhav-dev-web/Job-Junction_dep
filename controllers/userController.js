import { catchAsyncErrors } from "../middleware/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middleware/error.js";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  const { email, password, name, phone, role } = req.body;

  if (!name || !phone || !role || !email || !password) {
    return next(new ErrorHandler("Please Fill the form"));
  }

  const isEmail = await User.findOne({ email });

  if (isEmail) {
    return next(new ErrorHandler("Email already registered"));
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
  });

  sendToken(user, 200, res, "User registered successfully");
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide the required fields"));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password.", 400));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password.", 400));
  }

  if (user.role !== role) {
    return next(
      new ErrorHandler(`User with provided email and ${role} not found!`, 404)
    );
  }
  sendToken(user, 201, res, "User Logged In! Successfullly");
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged out successfully!",
    });
});

export const getUser = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});
