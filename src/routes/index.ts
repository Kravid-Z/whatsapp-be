import { Router } from "express";
import usersRouter from "./users";
// import roomsRouter from "../rooms";

const mainRouter: Router = Router();


mainRouter.use("/users", usersRouter);
// mainRouter.use("/users", roomsRouter);

export default mainRouter;
