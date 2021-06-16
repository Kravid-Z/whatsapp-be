import { UserDocument } from "../src/routes/users/types";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}
