import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.SECRECT_KEY;
declare global {
  namespace Express {
    interface Request {
      userid?: any;
    }
  }
}

const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization as string;
  if (!authHeader) {
    res.status(401).json({ error: "Authentication failed. Token is missing." });
    return;
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    res
      .status(401)
      .json({ error: "Authentication failed. Invalid token format." });
    return;
  }

  try {
    jwt.verify(token, secretKey);
    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication failed. Invalid token." });
  }
};

export default authenticate;
