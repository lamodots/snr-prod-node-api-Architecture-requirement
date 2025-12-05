import { prisma } from "../common/prisma";
import { User } from "./users.model";

export class UsersRepository {
  // Fetch all users
  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  // Fetch user by ID
  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  // Create new user
  async create(name: string, email: string): Promise<User> {
    return prisma.user.create({ data: { name, email } });
  }
}
