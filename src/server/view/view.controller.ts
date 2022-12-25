import type { FastifyRequest, FastifyReply } from "fastify";
import { Controller, Get, Res, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ViewService } from "./view.service";
import { splendid } from "package.json";

@Controller("/")
export class ViewController {
  constructor(private viewService: ViewService) {}

  @Get([
    splendid.adminDashboardPrefix + "/auth/login",
    splendid.adminDashboardPrefix + "/_next/*",
  ])
  public async login(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    this.viewService.server.panel.getRequestHandler()(req.raw, res.raw);
  }

  @UseGuards(JwtAuthGuard)
  @Get(splendid.adminDashboardPrefix + "/*")
  public async panel(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    this.viewService.server.panel.getRequestHandler()(req.raw, res.raw);
  }

  @Get("*")
  public async global(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    this.viewService.server.global.getRequestHandler()(req.raw, res.raw);
  }
}
