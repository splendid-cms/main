import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { splendid } from "package.json";

import type { LoggerService } from "@nestjs/common";

export class MyLogger implements LoggerService {
  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {}

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    console.error(message, ...optionalParams);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {}

  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, ...optionalParams: any[]) {}

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any, ...optionalParams: any[]) {}
}

const bootstrap = async (): Promise<void> => {
  // register fastify-cookie plugin
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false,
    })
  );
  app.register(import("@fastify/cookie") as any);
  app.useLogger(new MyLogger());

  // API routes start with /api
  // Excluding what's in the view module (Next.js sessions)
  app.setGlobalPrefix("api", {
    exclude: [
      "/*",
      splendid.adminDashboardPrefix + "/*",
      splendid.adminDashboardPrefix + "/auth/login",
      splendid.adminDashboardPrefix + "/_next/*",
    ],
  });

  await app.listen(splendid.port, splendid.address);
};

bootstrap();
