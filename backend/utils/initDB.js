import bcrypt from "bcrypt";
import sqlite3 from "@journeyapps/sqlcipher";
import dotenv from "dotenv";
dotenv.config();
sqlite3.verbose();

const db = new sqlite3.Database("./secure.db");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SALT_ROUNDS = 10;

export async function initDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./secure.db");

    db.serialize(async () => {
      db.run(`PRAGMA key = '${process.env.DB_PASSWORD}';`);

      try {
        db.run(`PRAGMA key = '${process.env.DB_PASSWORD}';`);

        db.run(`
            CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              username TEXT NOT NULL UNIQUE,
              password TEXT NOT NULL
            );
          `);

        db.get(`SELECT COUNT(*) as count FROM users`, async (err, row) => {
          if (err) {
            reject(err);
            return;
          }

          if (row.count === 0) {
            const pass = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);
            const stmt = db.prepare(
              `INSERT INTO users (username, password) VALUES (?, ?)`
            );
            stmt.run("admin", pass);
            stmt.finalize(() => {
              console.log("Sample users inserted.");
              db.close();
              resolve();
            });
          } else {
            console.log("Sample users already exist. Skipping insert.");
            db.close();
            resolve();
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  });
}
