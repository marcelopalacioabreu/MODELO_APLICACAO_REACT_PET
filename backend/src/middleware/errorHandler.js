const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev (com emoji de elite)
  console.error('❌ [Error Handler]', err.stack);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Recurso não encontrado com o ID: ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Valor de campo duplicado inserido';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Erro Interno do Servidor'
  });
};

module.exports = errorHandler;
