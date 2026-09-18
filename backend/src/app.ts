import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import { env } from "./config/env";
import routes from "./routes";
import { generalLimiter } from "./middleware/rateLimiter";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin: [env.frontendOrigin, env.clientUrl],
      credentials: true,
    })
  );
  app.use(compression());
  app.use(express.json({ limit: `${env.maxUploadMb}mb` }));
  app.use(express.urlencoded({ extended: true }));
  if (!env.isProd) app.use(morgan("dev"));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "herway-ai-api", time: new Date().toISOString() });
  });

  app.use("/api", generalLimiter, routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
