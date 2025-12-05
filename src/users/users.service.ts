import { UsersRepository } from "./users.repository";
import { User } from "./users.model";

export class UsersService {
  constructor(private repo: UsersRepository) {} // Manual DI

  async getUsers(): Promise<User[]> {
    return this.repo.findAll();
  }

  async getUser(id: number): Promise<User | null> {
    return this.repo.findById(id);
  }

  async createUser(name: string, email: string): Promise<User> {
    return this.repo.create(name, email);
  }
}
