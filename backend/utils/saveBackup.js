import fs from "fs";
import path from "path";
import dayjs from "dayjs";

export function saveBackup(file) {
  const logsDir = path.resolve("./logs");
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
  }
  const backupFileName = `${dayjs().format("YYYYMMDD_HHmmss")}_config.json`;
  const backupFilePath = path.join(logsDir, backupFileName);
  fs.writeFileSync(backupFilePath, file, "utf8");
  return backupFileName;
}
