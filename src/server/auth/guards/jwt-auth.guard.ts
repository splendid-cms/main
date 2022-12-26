import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { splendid } from "package.json";
import type { FastifyReply } from "fastify";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(err: any, user: any, info: any, context: any) {
    if (err || !user) {
      const res: FastifyReply = context.getResponse();
      throw (
        res
          .code(301)
          .redirect(`/${splendid.adminDashboardPrefix}/auth/login`) ||
        new UnauthorizedException()
      );
    }
    if (err)
      throw {
        statusCode: 401,
      };
    return user;
  }
}
