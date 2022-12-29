import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";

type User = {
  user: { username: string; userId: string }
} | any; // any because of the way the LocalAuthGuard works

type RequestType = FastifyRequest<{
  Body: { username: string; userId: string };
}>;

@Controller("/")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("auth/login")
  async login(@Req() req: RequestType) {
    const { user }: User = req;
    return this.authService.login(user);
  }
}
