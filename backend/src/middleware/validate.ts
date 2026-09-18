import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodTypeAny } from "zod";
import { ApiError } from "../utils/ApiError";

type Source = "body" | "query" | "params";

/** Validate and replace req[source] with the parsed, typed value. */
export function validate(schema: ZodTypeAny, source: Source = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[source]);
      // query/params are read-only getters in some Express versions; assign safely.
      if (source === "query") {
        Object.assign(req.query, parsed);
      } else {
        (req as unknown as Record<string, unknown>)[source] = parsed;
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        }));
        return next(ApiError.badRequest("Please check the highlighted fields.", details));
      }
      next(err);
    }
  };
}
