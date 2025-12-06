import express from "express";
import { createUsersRouter } from "./users/users.module";

const app = express();
app.use(express.json());

// Register feature modules
app.use("/users", createUsersRouter());

export default app;
