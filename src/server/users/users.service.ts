import { Injectable } from "@nestjs/common";
import config from "config.json";

export type User = any;

const users: User[] = config.Users.map((user) => {
  return {
    userId: user.ID,
    username: user.Name,
    password: user.Password,
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
