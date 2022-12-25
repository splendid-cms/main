import { Injectable } from "@nestjs/common";
import { Converter } from "showdown";
import { splendid } from "package.json";

export interface Overview {
  body: {
    markdown: string;
    html: string;
  }
};

@Injectable()
export class OverviewService {
  private readonly converter = new Converter(
    splendid.experimental.markdownConverterOptions
  );

  public readonly overviewApiUrl =
    "https://raw.githubusercontent.com/splendid-cms/main/main/README.md";

  public async fetchOverview(): Promise<Response> {
    return fetch(this.overviewApiUrl);
  };

  public parseOverview(overview: any): Overview {
    return {
      body: {
        markdown: overview,
        html: this.converter.makeHtml(overview),
      }
    };
  };

  public async getOverview(): Promise<Overview> {
    const response = await this.fetchOverview();
    const overview = await response.text();
    return this.parseOverview(overview);
  };
};
