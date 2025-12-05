import { Router } from "express";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";

const router = Router();

// Manual DI chain: Repository → Service → Controller
const repo = new UsersRepository();
const service = new UsersService(repo);
const controller = new UsersController(service);

router.get("/", controller.getUsers);
router.get("/:id", controller.getUser);
router.post("/", controller.createUser);

export default router;
