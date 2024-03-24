/**
 * Custom error handler class to create error objects with a message and status code.
 * @class ErrorHandler
 * @extends Error
 */
class ErrorHandler extends Error {
  /**
   * Creates an instance of ErrorHandler.
   * @param {string} message - The error message.
   * @param {number} statusCode - The HTTP status code associated with the error.
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Middleware function to handle errors and send appropriate error responses.
 * @param {Error} err - The error object.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next function to pass control to the next middleware.
 * @returns {object} - JSON response with error details.
 */
export const errorMiddleware = (err, req, res, next) => {
  // Set default error message and status code if not provided
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // Handle specific error types and modify error object if needed
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again!`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, Try again!`;
    err = new ErrorHandler(message, 400);
  }

  // Send error response with appropriate status code and message
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;
