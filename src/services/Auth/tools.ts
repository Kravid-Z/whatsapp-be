import jwt from "jsonwebtoken";
import { TokenPayload } from "./types";
import { UserDocument } from "../../routes/users/types";

export const authenticate = async (user: UserDocument) => {
  const accessToken = await generateJWT({ _id: user._id });

  if (accessToken) {
    return accessToken;
  } else {
    throw new Error("Error during token generation!");
  }
};

const generateJWT = (payload: TokenPayload): Promise<string | undefined> =>
  new Promise((res, rej) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: "1 day" },
      (err, token) => {
        if (err) rej(err);
        res(token);
      }
    )
  );

export const verifyJWT = (token: string): Promise<TokenPayload | undefined> =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      if (err) rej(err);
      res(decoded as TokenPayload);
    })
  );
