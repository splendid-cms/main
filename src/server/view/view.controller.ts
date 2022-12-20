import { Controller, Get, Res, Req } from "@nestjs/common";
import type { FastifyRequest, FastifyReply } from "fastify";
import type { RequestHandler } from "next/dist/server/next";
import config from "config.json";

import { ViewService } from "./view.service";

@Controller("/")
export class ViewController {
  constructor(private viewService: ViewService) {}

  @Get("*")
  public async panel(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const { server } = this.viewService;
    let handle: RequestHandler = server.global.getRequestHandler();
    if (req.url.startsWith("/" + config["Admin dashboard prefix"]))
      handle = server.panel.getRequestHandler();
    handle(req.raw, res.raw);
  }
}
