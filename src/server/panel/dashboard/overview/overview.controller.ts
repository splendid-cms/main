import { Controller, Get } from "@nestjs/common";
import { OverviewService } from "./overview.service";

@Controller("dashboard/")
export class OverviewController {
  constructor(private readonly overviewService: OverviewService) {};

  @Get("overview/get")
  async overview(): Promise<any> {
    return this.overviewService.getOverview();
  };
};
