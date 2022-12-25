import { Injectable } from "@nestjs/common";
import { Converter } from "showdown";
import { splendid } from "package.json";

export interface ChangeLog {
  name: string;
  body: {
    markdown: string;
    html: string;
  };
};

@Injectable()
export class ChangeLogService {
  private readonly converter = new Converter(
    splendid.experimental.markdownConverterOptions
  );
  
  public readonly changeLogApiUrl =
    "https://api.github.com/repos/splendid-cms/main/releases";

  public async fetchChangeLog(): Promise<Response> {
    return fetch(this.changeLogApiUrl);
  };

  public parseChangeLog(changeLog: any[]): ChangeLog[] {
    return changeLog.map((release: any) => ({
      name: release.name,
      body: {
        markdown: release.body,
        html: this.converter.makeHtml(release.body)
      },
    }));
  };

  public async getChangeLog(): Promise<ChangeLog[]> {
    const response = await this.fetchChangeLog();
    const changeLog = await response.json();
    return this.parseChangeLog(changeLog);
  };
};
