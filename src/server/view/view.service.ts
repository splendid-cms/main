import { Injectable, OnModuleInit } from "@nestjs/common";
import next from "next";
import config from "@config";
import type { NextServer } from "next/dist/server/next";

@Injectable()
export class ViewService implements OnModuleInit {
  public server: { global: NextServer; panel: NextServer };
  public development: boolean = config.experimental.developmentEnvironment;

  async onModuleInit(): Promise<void> {
    try {
      this.server = {
        global: next({ dir: "./src/client/global", dev: this.development }),
        panel: next({ dir: "./src/client/panel", dev: this.development }),
      };
      await this.server.global.prepare();
      await this.server.panel.prepare();
    } catch (error) {
      console.error(error);
    }
  }
}
