import { Injectable, Req } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { Database } from "src/library/database";

export interface Traffic {
  timestamp?: Date;
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
      visitors,
    };
  }

  public async getDailyTraffic(
    weeklyTraffic: Traffic[],
    day: number
  ): Promise<Traffic[]> {
    // Filter traffic by day of the year, if getDay() returns 0, it's Sunday, so we need to set it to 7
    const dailyTraffic: Traffic[] = weeklyTraffic.filter(
      (trafficItem: Traffic) =>
        (trafficItem.timestamp.getDay() || 7) - 1 === day
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

    const weekNumber = (d: Date = new Date()) => {
      let date = new Date(d.getTime());
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));

      let week1 = new Date(date.getFullYear(), 0, 4);
      return (
        1 +
        Math.round(
          ((date.getTime() - week1.getTime()) / 86400000 -
            3 +
            ((week1.getDay() + 6) % 7)) /
            7
        )
      );
    };

    const week: Traffic[] = traffic.filter(
      (trafficItem: Traffic) =>
        weekNumber(trafficItem.timestamp) === weekNumber(new Date()) &&
        trafficItem.timestamp.getFullYear() === new Date().getFullYear()
    );

    let weekTraffic: ParsedTraffic[] = [];
    for (let i = 0; i < 7; i++) {
      weekTraffic.push(
        await this.parseTraffic(await this.getDailyTraffic(week, i))
      );
    }

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
      .catch((err) => {});
  }
}
