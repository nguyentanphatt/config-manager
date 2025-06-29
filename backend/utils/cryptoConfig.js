import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
const IV_LENGTH = 16;

if (!SECRET_KEY || Buffer.from(SECRET_KEY, "utf8").length !== 32) {
  throw new Error("SECRET_KEY phải là chuỗi 32 ký tự ASCII (32 bytes).");
}

export function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(SECRET_KEY, "utf8"),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return iv.toString("base64") + ":" + encrypted;
}

export function decrypt(text) {
  const [ivBase64, encryptedData] = text.split(":");
  const iv = Buffer.from(ivBase64, "base64");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(SECRET_KEY, "utf8"),
    iv
  );
  let decrypted = decipher.update(encryptedData, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
