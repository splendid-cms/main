import { Controller, Get, UseGuards } from "@nestjs/common";
import { TrafficService, ParsedTraffic } from "./traffic.service";
import { JwtAuthGuard } from "src/server/auth/guards/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("analytics/traffic/")
export class TrafficController {
  constructor(private readonly trafficService: TrafficService) {};

  @Get("complete")
  public async completeTraffic(): Promise<ParsedTraffic> {
    return this.trafficService.getCompleteTraffic();
  };

  @Get("weekly")
  public async weeklyTraffic(): Promise<ParsedTraffic[]> {
    return this.trafficService.getWeeklyTraffic();
  };
};
