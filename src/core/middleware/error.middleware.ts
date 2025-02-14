import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../enums';
import { logger } from '../utils';

const ErrorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = (error as any).status || HttpStatus.SERVER_ERROR;
  const message = error.message || 'Something went wrong';

  // Log the error
  logger.error(`[${req.method}] ${req.path} >> ${message}`, error);

  // Send error response
  res.status(status).json({
    status: 'error',
    statusCode: status,
    message,
  });
};

export default ErrorMiddleware;