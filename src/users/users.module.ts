import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { createUsersRoutes } from "./users.routes";

export function createUsersRouter() {
  // Manual DI chain
  const repo = new UsersRepository();
  const service = new UsersService(repo);
  const controller = new UsersController(service);

  // Pass controller into routes factory
  return createUsersRoutes(controller);
}
