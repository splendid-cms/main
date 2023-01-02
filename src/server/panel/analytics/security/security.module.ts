import { Module } from "@nestjs/common";

import { SecurityController } from "./security.controller";
import { SecurityService } from "./security.service";

@Module({
  providers: [SecurityService],
  controllers: [SecurityController],
})
export class SecurityModule {};
