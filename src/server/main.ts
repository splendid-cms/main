import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import config from "config.json";

const bootstrap = async (): Promise<void> => {
  // register fastify-cookie plugin
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  app.register(import("@fastify/cookie") as any);

  await app.listen(config.Port, config.Address);
};

bootstrap();
