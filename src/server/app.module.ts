import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ChangeLogModule } from "./panel/dashboard/change-log/change-log.module";
import { OverviewModule } from "./panel/dashboard/overview/overview.module";
import { UsersModule } from "./users/users.module";
import { ViewModule } from "./view/view.module";

@Module({
  imports: [ViewModule, AuthModule, UsersModule, ChangeLogModule, OverviewModule],
  providers: [AppService],
})
export class AppModule {}
