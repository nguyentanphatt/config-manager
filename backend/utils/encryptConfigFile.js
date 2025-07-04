import fs from "fs";
import { encrypt } from "./cryptoConfig.js";

//const configPath = "./config.json";
//const plain = fs.readFileSync(configPath, "utf8");

export function encryptConfigFile(configPath = "./config.json") {
  const plain = fs.readFileSync(configPath, "utf8");
  try {
    JSON.parse(plain);
    const encrypted = encrypt(plain);
    fs.writeFileSync(configPath, encrypted, "utf8");
    console.log("Encrypted config.json successful!");
  } catch {
    console.log("File has been encrypted.");
  }
}

/* try {
  JSON.parse(plain);
} catch {
  console.log("File has been encrypted.");
  process.exit(0);
}

const encrypted = encrypt(plain);
fs.writeFileSync(configPath, encrypted, "utf8");
console.log("Encrypted config.json successful!"); */
