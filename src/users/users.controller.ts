import { Request, Response } from "express";
import { UsersService } from "./users.service";

export class UsersController {
  constructor(private service: UsersService) {} // Manual DI

  getUsers = async (req: Request, res: Response) => {
    const users = await this.service.getUsers();
    res.json(users);
  };

  getUser = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const user = await this.service.getUser(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  };

  createUser = async (req: Request, res: Response) => {
    const { name, email } = req.body;
    const user = await this.service.createUser(name, email);
    res.status(201).json(user);
  };
}
