import fs from "fs";
import { encrypt } from "./cryptoConfig.js";

const configPath = "./config.json";

// Đọc file plain JSON
const plain = fs.readFileSync(configPath, "utf8");

// Nếu đã encrypt rồi thì không làm gì nữa
try {
  JSON.parse(plain);
} catch {
  console.log("File đã được mã hóa, không cần encrypt lại.");
  process.exit(0);
}

// Encrypt và ghi đè lại file
const encrypted = encrypt(plain);
fs.writeFileSync(configPath, encrypted, "utf8");
console.log("Đã mã hóa file config.json thành công!");
