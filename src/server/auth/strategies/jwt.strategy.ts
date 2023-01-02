import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import config from "@config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => request?.cookies?.access_token
      ]),
      ignoreExpiration: false,
      secretOrKey: config.auth.secretKey
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
