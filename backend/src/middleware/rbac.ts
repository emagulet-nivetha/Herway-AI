import type { Role } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

/** Restrict a route to one or more roles. Assumes `authenticate` ran first. */
export function requireRoles(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden());
    }
    next();
  };
}

/** Allow only the owner of a resource (or an admin) to continue. */
export function requireSelfOrAdmin(paramKey = "id") {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(ApiError.unauthorized());
    const targetId = req.params[paramKey] || req.body?.userId;
    if (req.user.role === "platform_admin") return next();
    if (req.user.role === "cooperative_admin") return next();
    if (targetId && req.user.id !== targetId) {
      return next(ApiError.forbidden());
    }
    next();
  };
}
