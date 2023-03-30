import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import tryCatch from "../error-handling/tryCatch";
import dotenv from "dotenv";
import CustomError from "../error-handling/customError";
dotenv.config();

type User = {
  id: string;
  email: string;
};

type JwtPayload = {
  user: User;
};

const jwtSecret = process.env.JWT_SECRET;

/* This function sends a signed JSON Web Token (JWT) to the client as a cookie.
It will expire in 1 hour. */
export const signToken = (user: User) => {
  if (!jwtSecret) throw new CustomError("JWT secret not found", 500);
  const token = jwt.sign({ user }, jwtSecret, {
    expiresIn: "1h",
  });

  return token;
};

/* This function authenticates a user by extracting the JWT token 
from the cookies in the request object, verifying it, and then adding 
user object to the request object before calling the next middleware. */
export const authenticate = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!jwtSecret) throw new CustomError("JWT secret not found.", 500);

    const token = req.cookies.token;

    if (!token) throw new CustomError("Please log in first", 401);

    const { user } = jwt.verify(token, jwtSecret) as JwtPayload;

    if (!user) throw new CustomError("Please log in first", 401);

    const decoded: any = jwt.verify(token, jwtSecret);

    req.user = decoded.user;
    next();
  }
);
