import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH;

const PRIVATE_KEY = fs.readFileSync(PRIVATE_KEY_PATH, "utf8");
export const login = async (req, res) => {
  const { username, password } = req.body;

  const isValid = username === "admin" && password === "admin123";
  if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

  const payload = {
    sub: username,
    role: "admin",
  };

  const token = jwt.sign(payload, PRIVATE_KEY, {
    algorithm: "RS256",
    expiresIn: "1h",
  });

  res.json({ token });
};
