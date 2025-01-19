class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.statusCode || "Internal Server Error";
  res.status(statusCode).json({ error: message });
};

module.exports = { AppError, errorMiddleware };