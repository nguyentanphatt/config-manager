import jwt from "jsonwebtoken";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const PUBLIC_KEY_PATH = process.env.PUBLIC_KEY_PATH;
const PUBLIC_KEY = fs.readFileSync(PUBLIC_KEY_PATH, "utf8");
export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : req.cookies?.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token is missing or invalid",
    });
  }

  jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] }, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Token verification failed",
      });
    }
    req.user = user;
    next();
  });
}
