import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import config from "@config";

import type { FastifyReply } from "fastify";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(err: any, user: any, _info: any, context: any) {
    const res: FastifyReply = context.getResponse();
    res.raw.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    if (err || !user) {
      res
        .code(301)
        .redirect(`/${config.adminDashboardPrefix}/auth/login`);
      throw new UnauthorizedException()
    }
    return user;
  }
}
