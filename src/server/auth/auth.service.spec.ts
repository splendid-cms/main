import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { Test, TestingModule } from "@nestjs/testing";
import { UsersModule } from "../users/users.module";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import config from "@config";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
          secret: config.auth.secretKey,
          signOptions: { expiresIn: config.auth.expiresIn },
        }),
      ],
      providers: [AuthService, LocalStrategy, JwtStrategy],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});

describe("validateUser", () => {
  let service: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
          secret: config.auth.secretKey,
          signOptions: { expiresIn: config.auth.expiresIn },
        }),
      ],
      providers: [AuthService, LocalStrategy, JwtStrategy],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
  });

  it("should return a user object when credentials are valid", async () => {
    const res = await service.validateUser("Your name", "johnathan789890");
    expect(res.userId).toEqual(3);
  });

  it("should return null when credentials are invalid", async () => {
    const res = await service.validateUser("xxx", "xxx");
    expect(res).toBeNull();
  });
});

describe("validateLogin", () => {
  let service: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
          secret: config.auth.secretKey,
          signOptions: { expiresIn: config.auth.expiresIn },
        }),
      ],
      providers: [AuthService, LocalStrategy, JwtStrategy],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
  });

  it("should return JWT object when credentials are valid", async () => {
    const res = await service.login({ username: "Your name", userId: 1 });
    expect(res.access_token).toBeDefined();
  });
});
