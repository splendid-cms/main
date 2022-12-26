import { Injectable } from "@nestjs/common";
import { convert } from "src/library/converter";

export interface Overview {
  body: {
    markdown: string;
    html: string;
  }
};

@Injectable()
export class OverviewService {

  public readonly overviewApiUrl =
    "https://raw.githubusercontent.com/splendid-cms/main/main/README.md";

  public async fetchOverview(): Promise<Response> {
    return fetch(this.overviewApiUrl);
  };

  public async parseOverview(overview: any): Promise<Overview> {
    return {
      body: {
        markdown: overview,
        html: await convert(overview),
      }
    };
  };

  public async getOverview(): Promise<Overview> {
    const response = await this.fetchOverview();
    const overview = await response.text();
    return this.parseOverview(overview);
  };
};