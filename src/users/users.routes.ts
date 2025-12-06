import { Router } from "express";
import { UsersController } from "./users.controller";

/**
 * Functional route setup.
 * Instead of creating dependencies here,
 * we accept a controller instance from the module factory.
 */
export function createUsersRoutes(controller: UsersController): Router {
  const router = Router();

  // Map routes to controller methods
  router.get("/", controller.getUsers);
  router.get("/:id", controller.getUser);
  router.post("/", controller.createUser);

  return router;
}
