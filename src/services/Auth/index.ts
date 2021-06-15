import { Request, Response, NextFunction } from "express";

import { verifyJWT } from "./tools";
import UserModel from "../../models/userModel";

type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export const JWTAuthMiddleware: MiddlewareFunction = async (req, res, next) => {
  try {
    if (req.cookies && req.cookies.accessToken) {
      const accessToken = req.cookies.accessToken;

      const decoded = await verifyJWT(accessToken);

      const user = await UserModel.findById(decoded!._id);

      if (user) {
        req.user = user;
      } else {
        throw new Error("User not found!");
      }
    }
  } catch (error) {
    next(error);
  }
};
