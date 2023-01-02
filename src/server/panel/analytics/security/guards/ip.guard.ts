import {
  Injectable,
  ForbiddenException,
  CanActivate,
  ExecutionContext,
} from "@nestjs/common";
import { Database } from "src/library/database";

import type { FastifyRequest } from "fastify";
import { Observable } from "rxjs";

@Injectable()
export class IPGuard implements CanActivate {
  private _database: Database = new Database();

  public get database(): Database {
    return this._database;
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: FastifyRequest = context.switchToHttp().getRequest();
    return this.database.findIP(req.ip).then((found) => {
      if (found) return true;
      throw new ForbiddenException(
        "You are not allowed to access this resource"
      );
    })
  }
}
