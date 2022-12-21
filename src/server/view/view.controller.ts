import type { FastifyRequest, FastifyReply } from "fastify";
import { Controller, Get, Res, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ViewService } from "./view.service";
import config from "config.json";

@Controller("/")
export class ViewController {
  constructor(private viewService: ViewService) {}

  @Get([
    config["Admin dashboard prefix"] + "/auth/*",
    config["Admin dashboard prefix"] + "/_next/*",
  ])
  public async login(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    this.viewService.server.panel.getRequestHandler()(req.raw, res.raw);
  }

  @UseGuards(JwtAuthGuard)
  @Get(config["Admin dashboard prefix"] + "/*")
  public async panel(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    this.viewService.server.panel.getRequestHandler()(req.raw, res.raw);
  }

  @Get("*")
  public async global(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    this.viewService.server.global.getRequestHandler()(req.raw, res.raw);
  }
}
