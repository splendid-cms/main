import { Injectable } from "@nestjs/common";
import { Database, IP } from "src/library/database";

@Injectable()
export class SecurityService {
  private _database: Database = new Database();

  public get database(): Database {
    return this._database;
  }

  public async getBlockedIPs(): Promise<IP[]> {
    const blockedIPs = await this.database.getIPs({
      blocked: true,
    });
    return blockedIPs;
  }

  public async getWhitelistedIPs(): Promise<IP[]> {
    const whitelistedIPs = await this.database.getIPs({
      whitelist: true,
    });
    return whitelistedIPs;
  }

  public async testIP(ip: string): Promise<boolean> {
    return /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/g.test(ip) && ip !== "127.0.0.1";
  }

  public async blockIP(ip: string): Promise<IP> {
    const blockedIP = await this.database.updateIP(ip, {
      blocked: true,
    });
    return blockedIP;
  }

  public async whitelistIP(ip: string): Promise<IP> {
    const whitelistedIP = await this.database.updateIP(ip, {
      whitelist: true,
    });
    return whitelistedIP;
  }

  public async unblockIP(ip: string): Promise<IP> {
    const unblockedIP = await this.database.updateIP(ip, {
      blocked: false,
    });
    return unblockedIP;
  }

  public async unwhitelistIP(ip: string): Promise<IP> {
    const unwhitelistedIP = await this.database.updateIP(ip, {
      whitelist: false,
    });
    return unwhitelistedIP;
  }
}
