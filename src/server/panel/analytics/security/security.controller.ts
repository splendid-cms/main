import { BadRequestException, Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { SecurityService } from "./security.service";
import { JwtAuthGuard } from "src/server/auth/guards/jwt-auth.guard";
import { IP } from "src/library/database";

@UseGuards(JwtAuthGuard)
@Controller("analytics/security/")
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get("ips/blocked")
  public async blockedIPs(): Promise<IP[]> {
    return this.securityService.getBlockedIPs();
  }

  @Get("ips/whitelisted")
  public async whitelistedIPs(): Promise<IP[]> {
    return this.securityService.getWhitelistedIPs();
  }

  @Post("ips/block")
  public async blockIP(@Body() body: string[]): Promise<BadRequestException | IP[]> {
    if (!body.every((ip: string) => this.securityService.testIP(ip))) throw new BadRequestException();
    const blockedIPs = await Promise.all(body.map((ip: string) => this.securityService.blockIP(ip)));

    return blockedIPs;
  }

  @Post("ips/whitelist")
  public async whitelistIP(@Body() body: string[]): Promise<BadRequestException | IP[]> {
    if (!body.every((ip: string) => this.securityService.testIP(ip))) throw new BadRequestException();
    const whitelistedIPs = await Promise.all(body.map((ip: string) => this.securityService.whitelistIP(ip)));

    return whitelistedIPs;
  }

  @Post("ips/unblock")
  public async unblockIP(@Body() body: string[]): Promise<BadRequestException | IP[]> {
    if (!body.every((ip: string) => this.securityService.testIP(ip))) throw new BadRequestException();
    const unblockedIPs = await Promise.all(body.map((ip: string) => this.securityService.unblockIP(ip)));

    return unblockedIPs;
  }

  @Post("ips/unwhitelist")
  public async unwhitelistIP(@Body() body: string[]): Promise<BadRequestException | IP[]> {
    if (!body.every((ip: string) => this.securityService.testIP(ip))) throw new BadRequestException();
    const unwhitelistedIPs = await Promise.all(body.map((ip: string) => this.securityService.unwhitelistIP(ip)));

    return unwhitelistedIPs;
  }
}
