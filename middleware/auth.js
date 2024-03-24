import { User } from "../models/userSchema.js"; // Importing the User model/schema to interact with user data
import { catchAsyncErrors } from "./catchAsyncError.js"; // Importing the catchAsyncErrors utility function to handle asynchronous errors
import ErrorHandler from "./error.js"; // Importing the ErrorHandler class for generating custom error messages
import jwt from "jsonwebtoken"; // Importing the JSON Web Token (JWT) library for token verification

/**
 * Middleware function to verify if a user is authenticated.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next function to pass control to the next middleware.
 * @returns {Promise<void>} - A Promise representing the asynchronous operation.
 */
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  // Extracting the JWT token from the request cookies
  const { token } = req.cookies;

  // If no token is present, return an error indicating that the user is not authorized
  if (!token) {
    return next(new ErrorHandler("User not authorized", 401));
  }

  // Verifying the JWT token using the secret key

  // console.log("this is decoded", decoded.id);

  // Finding the user associated with the decoded token's user ID
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded.id);

  next();
});
