import type { FastifyRequest, FastifyReply } from "fastify";
import { Controller, Get, Res, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ViewService } from "./view.service";
import config from "@config";
import { TrafficService } from "../panel/analytics/traffic/traffic.service";

@Controller("/")
export class ViewController {
  constructor(
    private viewService: ViewService,
    private trafficService: TrafficService
  ) {}

  @Get([
    config.adminDashboardPrefix + "/auth/login",
    config.adminDashboardPrefix + "/_next/*",
  ])
  public async login(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    this.viewService.server.panel.getRequestHandler()(req.raw, res.raw);
  }

  @UseGuards(JwtAuthGuard)
  @Get([
    config.adminDashboardPrefix,
    config.adminDashboardPrefix + "/*"
  ])
  public async panel(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    this.viewService.server.panel.getRequestHandler()(req.raw, res.raw);
  }

  @Get("*")
  public async global(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    if (!req.url.startsWith("/_next")) this.trafficService.saveTraffic(req);
    this.viewService.server.global.getRequestHandler()(req.raw, res.raw);
  }
}
