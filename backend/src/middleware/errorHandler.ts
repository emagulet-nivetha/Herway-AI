import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";

/** Central error handler — keeps error responses consistent across the API. */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  const message = err instanceof Error ? err.message : "Unexpected server error";
  if (!env.isProd) {
    console.error("[HerWay] Unhandled error:", err);
  }

  return res.status(500).json({
    message: env.isProd ? "Something went wrong on our side." : message,
  });
}

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
}
