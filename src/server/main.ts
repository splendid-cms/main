import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { splendid } from "package.json";

const bootstrap = async (): Promise<void> => {
  // register fastify-cookie plugin
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  app.register(import("@fastify/cookie") as any);

  await app.listen(splendid.port, splendid.address);
};

bootstrap();
