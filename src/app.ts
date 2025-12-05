import express from "express";
import usersRoutes from "./users/users.routes";

const app = express();
app.use(express.json());

// Register feature modules
app.use("/users", usersRoutes);

export default app;
