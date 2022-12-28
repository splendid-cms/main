import { Controller, Get, UseGuards } from "@nestjs/common";
import { TrafficService, ParsedTraffic } from "./traffic.service";
import { JwtAuthGuard } from "src/server/auth/guards/jwt-auth.guard";

@Controller("analytics/")
export class TrafficController {
  constructor(private readonly trafficService: TrafficService) {};

  @UseGuards(JwtAuthGuard)
  @Get("traffic/complete/get")
  public async completeTraffic(): Promise<ParsedTraffic> {
    return this.trafficService.getCompleteTraffic();
  };

  @UseGuards(JwtAuthGuard)
  @Get("traffic/weekly/get")
  public async weeklyTraffic(): Promise<ParsedTraffic[]> {
    return this.trafficService.getWeeklyTraffic();
  };
};
