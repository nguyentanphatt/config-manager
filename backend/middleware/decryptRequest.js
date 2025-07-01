import fs from "fs";
import crypto from "crypto";

const PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH;
const PRIVATE_KEY = fs.readFileSync(PRIVATE_KEY_PATH, "utf8");
//const PRIVATE_KEY = fs.readFileSync("keys/private.pem", "utf8");

function decryptRSA(encryptedText) {
  const buffer = Buffer.from(encryptedText, "base64");
  const decrypted = crypto.privateDecrypt(
    {
      key: PRIVATE_KEY,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    buffer
  );
  return JSON.parse(decrypted.toString("utf8"));
}

export function decryptRequest(req, res, next) {
  try {
    if (req.body && Object.keys(req.body).length > 0) {
      req.body = decryptRSA(req.body.encrypted || req.body.encryptedBody);
    }
    if (req.query && req.query.encrypted) {
      req.query = decryptRSA(req.query.encrypted);
    }
    if (req.params && req.params.encrypted) {
      req.params = decryptRSA(req.params.encrypted);
    } else {
      for (const key in req.params) {
        if (req.params[key]) {
          try {
            req.params[key] = decryptRSA(req.params[key]);
          } catch (err) {}
        }
      }
    }

    next();
  } catch (err) {
    console.error("RSA decrypt error:", err);
    return res.status(400).json({ error: "Failed to decrypt data" });
  }
}
