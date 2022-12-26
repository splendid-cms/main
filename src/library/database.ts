import { PrismaClient } from "@prisma/client";

export interface Traffic {
  timestamp: Date;
  ip: string;
  path: string;
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
    const traffic = await this._client.traffic.findMany();
    return traffic;
  }

  public async addTraffic(traffic: Traffic): Promise<Traffic> {
    const newTraffic = await this._client.traffic.create({
      data: traffic,
    });
    return newTraffic;
  }
  // End traffic management
}
