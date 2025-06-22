import fs from "fs";
import { flattenObject } from "../utils/flattenObject.js";

export const fetchConfig = async (req, res) => {
  const data = JSON.parse(fs.readFileSync("./config.json", "utf8"));
  const flattened = flattenObject(data);
  res.json(flattened);
};

export const deleteConfigItem = async (req, res) => {
  const { key } = req.params;
  console.log("Deleting key:", key);
  const data = JSON.parse(fs.readFileSync("./config.json", "utf8"));
  const keys = key.split(".");
  let current = data;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      return res.status(404).json({ error: "Key not found" });
    }
    current = current[keys[i]];
  }

  if (!(keys[keys.length - 1] in current)) {
    return res.status(404).json({ error: "Key not found" });
  }

  delete current[keys[keys.length - 1]];
  fs.writeFileSync("./config.json", JSON.stringify(data, null, 2), "utf8");
  res.json({ success: true });
};

export const updateConfigItem = async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;

  if (!value) {
    return res.status(400).json({ error: "Value is required" });
  }

  const data = JSON.parse(fs.readFileSync("./config.json", "utf8"));
  const keys = key.split(".");
  let current = data;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      return res.status(404).json({ error: "Key not found" });
    }
    current = current[keys[i]];
  }

  current[keys[keys.length - 1]] = value;
  fs.writeFileSync("./config.json", JSON.stringify(data, null, 2), "utf8");
  res.json({ success: true });
};
