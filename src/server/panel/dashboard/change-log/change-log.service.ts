import { Injectable } from "@nestjs/common";
import { convert } from "src/library/converter";

export interface ChangeLog {
  name: string;
  body: {
    markdown: string;
    html: string;
  };
};

@Injectable()
export class ChangeLogService {
  public readonly changeLogApiUrl =
    "https://api.github.com/repos/splendid-cms/main/releases";

  public async fetchChangeLog(): Promise<Response> {
    return fetch(this.changeLogApiUrl);
  };

  public parseChangeLog(changeLog: any[]): Promise<ChangeLog[]> {
    const changeLogResponse = changeLog.map(async (release: any) => ({
      name: release.name,
      body: {
        markdown: release.body,
        html: await convert(release.body)
      },
    }));
    
    return Promise.all(changeLogResponse);
  };

  public async getChangeLog(): Promise<ChangeLog[]> {
    const response = await this.fetchChangeLog();
    const changeLog = await response.json();
    return this.parseChangeLog(changeLog);
  };
};
