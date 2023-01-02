import { Injectable } from "@nestjs/common";
import { convert } from "src/library/converter";

export interface ChangeLog {
  author: {
    name: string;
    avatar: string;
    url: string;
  };
  name: string;
  body: {
    markdown: string;
    html: string;
  };
  publishedAt: Date;
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
      author: {
        name: release.author.login,
        avatar: release.author.avatar_url,
        url: release.author.html_url,
      },
      name: release.name,
      body: {
        markdown: release.body,
        html: await convert(release.body)
      },
      publishedAt: release.published_at,
    }));
    
    // Async map returns an array of promises,
    // so we need to wait for all of them to resolve
    return Promise.all(changeLogResponse);
  };

  public async getChangeLog(): Promise<ChangeLog[]> {
    const response = await this.fetchChangeLog();
    const changeLog = await response.json();
    return this.parseChangeLog(changeLog);
  };
};
