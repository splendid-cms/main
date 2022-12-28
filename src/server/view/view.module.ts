import { Module } from "@nestjs/common";

import { ViewController } from "./view.controller";
import { ViewService } from "./view.service";
import { TrafficService } from "../panel/analytics/traffic/traffic.service";

@Module({
  imports: [],
  providers: [ViewService, TrafficService],
  controllers: [ViewController],
})
export class ViewModule {}
