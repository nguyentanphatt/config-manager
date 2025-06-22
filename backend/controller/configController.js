import fs from "fs";
import { flattenObject } from "../utils/flattenObject.js";
import { getNestedTarget } from "../utils/getNestedTarget.js";
import { parseKeyPath } from "../utils/parseKeyPath.js";

export const fetchConfig = async (req, res) => {
  const data = JSON.parse(fs.readFileSync("./config.json", "utf8"));
  const flattened = flattenObject(data);
  res.json(flattened);
};

export const deleteConfigItem = async (req, res) => {
  const { key } = req.params;
  const keys = parseKeyPath(key);
  const data = JSON.parse(fs.readFileSync("./config.json", "utf8"));

  const parent = getNestedTarget(data, keys);
  const lastKey = keys[keys.length - 1];

  if (!parent || !(lastKey in parent)) {
    return res.status(404).json({ error: "Key not found" });
  }

  if (Array.isArray(parent)) {
    const index = parseInt(lastKey);
    if (!isNaN(index) && index < parent.length) {
      parent.splice(index, 1);
    } else {
      return res.status(400).json({ error: "Invalid array index" });
    }
  } else {
    delete parent[lastKey];
  }

  fs.writeFileSync("./config.json", JSON.stringify(data, null, 2), "utf8");
  res.json({ success: true });
};

export const updateConfigItem = async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;

  if (typeof value === "undefined") {
    return res.status(400).json({ error: "Value is required" });
  }

  const keys = parseKeyPath(key);
  const data = JSON.parse(fs.readFileSync("./config.json", "utf8"));
  const parent = getNestedTarget(data, keys);
  const lastKey = keys[keys.length - 1];

  if (!parent || typeof parent !== "object") {
    return res.status(404).json({ error: "Key not found" });
  }

  if (Array.isArray(parent)) {
    const index = parseInt(lastKey);
    if (isNaN(index) || index >= parent.length) {
      return res.status(400).json({ error: "Invalid array index" });
    }
    parent[index] = value;
  } else {
    parent[lastKey] = value;
  }

  fs.writeFileSync("./config.json", JSON.stringify(data, null, 2), "utf8");
  res.json({ success: true });
};
