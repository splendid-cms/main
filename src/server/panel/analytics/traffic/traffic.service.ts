import { Injectable, Req } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { Database } from "src/library/database";

export interface Traffic {
  timestamp: Date;
  ip: string;
  path: string;
}

export interface ParsedTraffic {
  length: number;
  traffic: Traffic[];
  unique: {
    length: number;
    visitors: number;
    traffic: Traffic[];
  };
}

export interface UniqueTraffic {
  unique: Traffic[];
  visitors: number;
}

export enum Day {
  Monday = 0,
  Tuesday = 1,
  Wednesday = 2,
  Thursday = 3,
  Friday = 4,
  Saturday = 5,
  Sunday = 6,
}

@Injectable()
export class TrafficService {
  private _database: Database = new Database();

  public get database(): Database {
    return this._database;
  }

  public async getUniqueTraffic(traffic: Traffic[]): Promise<UniqueTraffic> {
    const unique: Traffic[] = traffic.filter(
      (trafficItem: Traffic, index: number) =>
        !traffic.find(
          (uniqueTrafficItem: Traffic, uniqueIndex: number) =>
            uniqueTrafficItem.ip === trafficItem.ip &&
            uniqueTrafficItem.path === trafficItem.path &&
            uniqueIndex < index
        )
    );
    const visitors: number = unique.filter(
      (trafficItem: Traffic, index: number) =>
        !unique.find(
          (uniqueTrafficItem: Traffic, uniqueIndex: number) =>
            uniqueTrafficItem.ip === trafficItem.ip && uniqueIndex < index
        )
    ).length;

    return {
      unique,
      visitors
    };
  }

  public async getDailyTraffic(
    weeklyTraffic: Traffic[],
    day: number
  ): Promise<Traffic[]> {
    const dailyTraffic: Traffic[] = weeklyTraffic.filter(
      (trafficItem: Traffic) => trafficItem.timestamp.getDay() - 1 === day
    );
    return dailyTraffic;
  }

  public async parseTraffic(traffic: Traffic[]): Promise<ParsedTraffic> {
    const uniqueTraffic: UniqueTraffic = await this.getUniqueTraffic(traffic);
    return {
      length: traffic.length,
      traffic,
      unique: {
        length: uniqueTraffic.unique.length,
        visitors: uniqueTraffic.visitors,
        traffic: uniqueTraffic.unique,
      },
    };
  }

  public async getWeeklyTraffic(): Promise<ParsedTraffic[]> {
    const traffic: Traffic[] = await this.database.getTraffic();
    const week: Traffic[] = traffic.filter(
      (trafficItem: Traffic) =>
        trafficItem.timestamp.getTime() >
        new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).getTime()
    );
    const weekTraffic: ParsedTraffic[] = [
      await this.parseTraffic(await this.getDailyTraffic(week, Day.Monday)),
      await this.parseTraffic(await this.getDailyTraffic(week, Day.Tuesday)),
      await this.parseTraffic(await this.getDailyTraffic(week, Day.Wednesday)),
      await this.parseTraffic(await this.getDailyTraffic(week, Day.Thursday)),
      await this.parseTraffic(await this.getDailyTraffic(week, Day.Friday)),
      await this.parseTraffic(await this.getDailyTraffic(week, Day.Saturday)),
      await this.parseTraffic(await this.getDailyTraffic(week, Day.Sunday)),
    ];
    return weekTraffic;
  }

  public async getCompleteTraffic(): Promise<ParsedTraffic> {
    const traffic: Traffic[] = await this.database.getTraffic();
    const trafficLog: ParsedTraffic = await this.parseTraffic(traffic);
    return trafficLog;
  }

  public async saveTraffic(@Req() req: FastifyRequest): Promise<void> {
    // Asynchronous database call
    // Saving traffic to database
    this.database
      .addTraffic({
        ip: req.ip,
        path: req.url,
        timestamp: new Date(),
      })
      .catch(() => {});
  }
}
