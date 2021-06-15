import { Router } from "express";
// import logOutRoute from "./users/logOutRoute";
// import registerRoute from "./users/registerRoute";
// import loginAndRefreshRoute from "./users/loginRoute";
import usersRouter from "./users";

const mainRouter: Router = Router();

// mainRouter.use("/register", registerRoute);
// mainRouter.use("/", loginAndRefreshRoute);
// mainRouter.use("/", logOutRoute);
mainRouter.use("/users/me", usersRouter);

export default mainRouter;
