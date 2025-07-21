/**
 * Error Handling Middleware
 * Centralized error handling for the API
 */

const errorHandler = (err, req, res, next) => {
  console.error('API Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    user: req.user?.id || 'anonymous',
    timestamp: new Date().toISOString(),
  });

  // Default error response
  let status = 500;
  let message = 'Internal server error';
  let details = {};

  // Handle specific error types
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation error';
    details = { fields: err.errors };
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid ID format';
  } else if (err.code === '23505') { // PostgreSQL unique constraint violation
    status = 409;
    message = 'Resource already exists';
    details = { constraint: err.constraint };
  } else if (err.code === '23503') { // PostgreSQL foreign key violation
    status = 400;
    message = 'Referenced resource does not exist';
  } else if (err.code === '23502') { // PostgreSQL not null violation
    status = 400;
    message = 'Required field missing';
    details = { field: err.column };
  } else if (err.status) {
    status = err.status;
    message = err.message;
  }

  // Don't leak internal error details in production
  const response = {
    error: message,
    timestamp: new Date().toISOString(),
    path: req.path,
  };

  // Add details in development or for client errors (4xx)
  if (process.env.NODE_ENV !== 'production' || status < 500) {
    if (Object.keys(details).length > 0) {
      response.details = details;
    }
    
    if (process.env.NODE_ENV !== 'production') {
      response.stack = err.stack;
    }
  }

  res.status(status).json(response);
};

// 404 handler for undefined routes
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
};

// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
};
