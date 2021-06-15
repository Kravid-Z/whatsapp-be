
import { UserDocument } from "../src/services/users/types"

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument
    }
  }
}