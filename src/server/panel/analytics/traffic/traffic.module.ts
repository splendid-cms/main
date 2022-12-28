import { Module } from "@nestjs/common";

import { TrafficController } from "./traffic.controller";
import { TrafficService } from "./traffic.service";

@Module({
  providers: [TrafficService],
  controllers: [TrafficController],
})
export class TrafficModule {};
