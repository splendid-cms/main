import { Module } from "@nestjs/common";

import { ChangeLogController } from "./change-log.controller";
import { ChangeLogService } from "./change-log.service";

@Module({
  providers: [ChangeLogService],
  controllers: [ChangeLogController],
})
export class ChangeLogModule {};
