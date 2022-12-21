import { Injectable, Req, Res, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import config from "config.json";
import type { FastifyReply } from "fastify";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(err: any, user: any, info: any, context: any) {
    if (err || !user) {
      const res: FastifyReply = context.getResponse();
      throw err || res.redirect(`/${config["Admin dashboard prefix"]}/auth/login`);
    }
    return user;
  }
}
