import { Module } from "@nestjs/common";

import { OverviewController } from "./overview.controller";
import { OverviewService } from "./overview.service";

@Module({
  providers: [OverviewService],
  controllers: [OverviewController],
})
export class OverviewModule {};
