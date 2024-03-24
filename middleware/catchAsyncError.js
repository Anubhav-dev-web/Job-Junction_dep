/**
 * Utility function to catch asynchronous errors in Express route handler functions.
 * @param {Function} theFunction - The asynchronous route handler function to be wrapped.
 * @returns {Function} - A wrapped function that catches errors and passes them to the Express error handling middleware.
 */
export const catchAsyncErrors = (theFunction) => {
  return (req, res, next) => {
    // Wrap the invocation of the asynchronous route handler function in a Promise
    Promise.resolve(theFunction(req, res, next))
      // If the asynchronous function resolves successfully, proceed to the next middleware
      .catch(next); // If an error occurs, pass it to the Express error handling middleware (next)
  };
};

//It is a higher order function , that recieves a function as a parameter and returns the function, after executing it .
