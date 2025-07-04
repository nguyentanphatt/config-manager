import fs from "fs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sqlite3 from "@journeyapps/sqlcipher";
import bcrypt from "bcrypt";
dotenv.config();

const PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH;
const PRIVATE_KEY = fs.readFileSync(PRIVATE_KEY_PATH, "utf8");
const DB_PASSWORD = process.env.DB_PASSWORD;

export const login = async (req, res) => {
  const { username, password } = req.body;
  const db = new sqlite3.Database("./secure.db");
  db.run(`PRAGMA key = '${DB_PASSWORD}';`);

  db.get(
    `SELECT * FROM users WHERE username = ?`,
    [username],
    async (err, user) => {
      if (err) {
        db.close();
        return res.status(500).json({ message: "Database error" });
      }
      if (!user) {
        db.close();
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const isValid = await bcrypt.compare(password, user.password);
      db.close();
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const payload = {
        sub: username,
        role: "admin",
      };

      const token = jwt.sign(payload, PRIVATE_KEY, {
        algorithm: "RS256",
        expiresIn: "1h",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
        maxAge: 60 * 60 * 1000,
      });

      res.status(200).json({ message: "Logged in" });
    }
  );
};
