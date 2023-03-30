import { Prisma } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import CustomError from "./customError";

/* Global error handling middleware verifies the error sorce and then 
sends an appropriate HTTP response with an error message and status 
code included. If the error is not recognized, it sends a 500 status 
code with a generic error message.*/
export default (
  err: CustomError | Prisma.PrismaClientKnownRequestError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2023") {
      res.status(404).json({
        message: "Requested resource was not found.",
        statusCode: 404,
      });
    } else if (err.code === "P2002") {
      res.status(409).json({
        message: "Conflict in database.",
        statusCode: 409,
      });
    } else {
      res.status(400).json({
        message: "Invalid request",
        statusCode: 400,
      });
    }
  }

  if (err instanceof CustomError) {
    res.status(err.statusCode).json(err);
  }

  res.status(500).json({
    name: "Internal Server Error",
    message: "An internal server error occurred",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
    statusCode: 500,
  });
};
