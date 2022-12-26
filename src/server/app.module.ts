import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ChangeLogModule } from "./panel/dashboard/change-log/change-log.module";
import { OverviewModule } from "./panel/dashboard/overview/overview.module";
import { UsersModule } from "./users/users.module";
import { ViewModule } from "./view/view.module";
import { ProcessorService } from "../library/processor";

@Module({
  imports: [ViewModule, AuthModule, UsersModule, ChangeLogModule, OverviewModule],
  providers: [ProcessorService]
})
export class AppModule {}
