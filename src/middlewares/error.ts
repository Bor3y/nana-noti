import Boom from "boom";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "joi";
import { parse } from "stacktrace-parser";

/**
 * Boomify all errors. should be placed before any error handler
 */
export const boomifyErrorsMiddleware = (err: any, req: Request, res: Response, next: NextFunction) : any => {
  if (!err) return next();
  if (!(err instanceof Error)) err = new Error(err);
  if ((err instanceof ValidationError)) err = Boom.badRequest(err.message);
  return next(err.isBoom ? err : Boom.boomify(err));
};

/**
 * Handle errors and send them accordingly to clients,
 *  should be placed after all error handlers
 */
export const errorHandlerMiddleware = (err: Boom, req: Request, res: Response, next: NextFunction) : any => {
  if (!err) return next();
  const payload = Object.assign(
    {},
    err.output.payload,
    err.data && err.data,
    process.env.NODE_ENV !== "production" && { stack: parse(err.stack) }
  );
  return res.status(err.output.statusCode).json(payload);
};
