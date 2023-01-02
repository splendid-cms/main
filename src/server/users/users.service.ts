import { Injectable } from "@nestjs/common";
import config from "@config";

export type User = any;

const users: User[] = config.users.map((user) => {
  return {
    userId: user.id,
    username: user.name,
    password: user.password,
  };
});

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor() {
    this.users = users;
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
