import fs from "fs";
import crypto from "crypto";

//const PUBLIC_KEY = fs.readFileSync("keys/public.pem", "utf8");
const PUBLIC_KEY_PATH = process.env.PUBLIC_KEY_PATH;
const PUBLIC_KEY = fs.readFileSync(PUBLIC_KEY_PATH, "utf8");
function encryptRSA(data) {
  const buffer = Buffer.from(JSON.stringify(data), "utf8");
  const encrypted = crypto.publicEncrypt(
    {
      key: PUBLIC_KEY,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    buffer
  );
  return encrypted.toString("base64");
}

export function encryptResponse(req, res, next) {
  const originalJson = res.json;

  res.json = function (data) {
    if (req.user) {
      return originalJson.call(this, data);
    }

    try {
      const encrypted = encryptRSA(data);
      return originalJson.call(this, { encryptedData: encrypted });
    } catch (err) {
      console.error("RSA encrypt error:", err);
      return res.status(500).json({ error: "Failed to encrypt response" });
    }
  };

  next();
}
