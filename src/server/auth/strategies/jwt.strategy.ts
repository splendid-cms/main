import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { splendid } from "package.json";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => request?.cookies?.access_token
      ]),
      ignoreExpiration: false,
      secretOrKey: splendid.auth.secretKey
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
