import { PrismaClient } from "@prisma/client";

export interface Traffic {
  timestamp?: Date;
  ip: string;
  path: string;
}

export interface UserLog {
  timestamp?: Date;
  ip: string;
}

export interface ErrorLog {
  timestamp?: Date;
  ip: string;
  error: string;
}

export interface IP {
  ip: string;
  blocked?: boolean;
  whitelist?: boolean;
  timestamp?: Date;
}

export interface IPOptions {
  blocked?: boolean;
  whitelist?: boolean;
}

export class Database {
  private static _instance: Database;
  private _client: PrismaClient;

  public constructor() {
    this._client = new PrismaClient();
  }

  public static get Instance(): Database {
    return this._instance || (this._instance = new this());
  }

  public get client(): PrismaClient {
    return this._client;
  }

  // Traffic management
  public async getTraffic(): Promise<Traffic[]> {
    const traffic = await this.client.traffic.findMany();
    return traffic;
  }

  public async addTraffic(traffic: Traffic): Promise<Traffic> {
    const newTraffic = await this.client.traffic.create({
      data: traffic,
    });
    return newTraffic;
  }
  // End traffic management

  // Log management
  public async getUserLogs(): Promise<UserLog[]> {
    const logs = await this.client.userLog.findMany();
    return logs;
  }

  public async addUserLog(log: UserLog): Promise<UserLog> {
    const newLog = await this.client.userLog.create({
      data: log,
    });
    return newLog;
  }

  public async getErrorLogs(): Promise<ErrorLog[]> {
    const logs = await this.client.errorLog.findMany();
    return logs;
  }

  public async addErrorLog(log: ErrorLog): Promise<ErrorLog> {
    const newLog = await this.client.errorLog.create({
      data: log,
    });
    return newLog;
  }
  // End log management

  // IP management
  public async getIPs(where: IPOptions): Promise<IP[]> {
    const ips = await this.client.iP.findMany({
      where: where,
    });
    return ips;
  }

  public async getIPsCount(where: IP): Promise<number> {
    const IPsCount = this.client.iP.count({
      where: where,
    });
    return IPsCount;
  }

  public async getIP(ip: string): Promise<IP> {
    const ipData = await this.client.iP.findUnique({
      where: {
        ip: ip,
      },
    });
    return ipData;
  }

  public async addIP(ip: IP): Promise<IP> {
    const newIP = await this.client.iP.create({
      data: ip,
    });
    return newIP;
  }

  public async updateIP(
    ip: string,
    update: IPOptions
  ): Promise<IP> {
    const upsertedIP = await this.client.iP.upsert({
      where: {
        ip: ip,
      },
      create: {
        ip: ip,
        ...update,
        timestamp: new Date(),
      },
      update: update,
    });
    return upsertedIP;
  }

  public async findIP(ip: string): Promise<boolean> {
    const ipData = await this.client.iP.findUnique({
      where: {
        ip: ip,
      },
    });
    return ipData ? true : false;
  }
  // End IP management
}
