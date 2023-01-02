import { Controller, Get } from "@nestjs/common";
import { ChangeLogService, ChangeLog } from "./change-log.service";

@Controller("dashboard/")
export class ChangeLogController {
  constructor(private readonly changeLogService: ChangeLogService) {};

  @Get("changelog")
  async changeLog(): Promise<ChangeLog[]> {
    return this.changeLogService.getChangeLog();
  };
};
