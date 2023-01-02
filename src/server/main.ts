import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { fastifyCookie } from "@fastify/cookie";
import { AppModule } from "./app.module";
import { IPGuard } from "./panel/analytics/security/guards/ip.guard";
import config from "@config";

// TODO: @splendid-cms/logr module
import type { LoggerService } from "@nestjs/common";

export class MyLogger implements LoggerService {
  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    console.log(...optionalParams);
    console.log(message, ...optionalParams);
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    console.error(message, ...optionalParams);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    console.warn(message, ...optionalParams);
  }

  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, ...optionalParams: any[]) {
    console.debug(message, ...optionalParams);
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any, ...optionalParams: any[]) {
    console.log(message, ...optionalParams);
  }
}

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  // Any because fastify-plugin type doesn't match adapter one
  app.register(fastifyCookie as any);
  app.useLogger(new MyLogger());
  app.useGlobalGuards(new IPGuard());

  // API routes start with /api
  // Excluding what's in the view module (Next.js sessions)
  app.setGlobalPrefix("api", {
    exclude: [
      "/*",
      config.adminDashboardPrefix,
      config.adminDashboardPrefix + "/*",
      config.adminDashboardPrefix + "/auth/login",
      config.adminDashboardPrefix + "/_next/*",
    ],
  });

  await app.listen(config.port, config.address);
};

bootstrap();
