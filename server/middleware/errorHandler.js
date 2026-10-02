const notFound = (req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';
  let errorCode = err.code || 'INTERNAL_ERROR';

  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found with specified identifier.';
    errorCode = 'INVALID_ID';
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value entered. Record already exists.';
    errorCode = 'DUPLICATE_ENTRY';
  } else if (err.name === 'ValidationError') {
    statusCode = 422;
    message = Object.values(err.errors).map(val => val.message).join(', ');
    errorCode = 'VALIDATION_ERROR';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token.';
    errorCode = 'TOKEN_INVALID';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token expired. Please log in again.';
    errorCode = 'TOKEN_EXPIRED';
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: {
      code: errorCode,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
};

module.exports = {
  notFound,
  errorHandler
};
