import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";
import { AuthModule } from "./auth/auth.module";
import { ChangeLogModule } from "./panel/dashboard/change-log/change-log.module";
import { OverviewModule } from "./panel/dashboard/overview/overview.module";
import { UsersModule } from "./users/users.module";
import { ViewModule } from "./view/view.module";
import { TrafficModule } from "./panel/analytics/traffic/traffic.module";
import { ProcessorService } from "../library/processor";
import { SecurityModule } from "./panel/analytics/security/security.module";

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    ViewModule,
    AuthModule,
    UsersModule,
    ChangeLogModule,
    OverviewModule,
    TrafficModule,
    SecurityModule
  ],
  providers: [ProcessorService],
})
export class AppModule {}
