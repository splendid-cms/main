import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { splendid } from "package.json";
import type { FastifyReply } from "fastify";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(err: any, user: any, info: any, context: any) {
    if (err || !user) {
      const res: FastifyReply = context.getResponse();
      throw err || res.redirect(`/${splendid.adminDashboardPrefix}/auth/login`);
    }
    return user;
  }
}
