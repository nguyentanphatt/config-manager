import fs from "fs";
import path from "path";
import { flattenObject } from "../utils/flattenObject.js";
import { getNestedTarget } from "../utils/getNestedTarget.js";
import { parseKeyPath } from "../utils/parseKeyPath.js";
/**
 * @description
 * Read data from config.json
 * Flatten it and return as JSON response
 */
export const fetchConfig = async (req, res) => {
  const data = JSON.parse(fs.readFileSync("./config.json", "utf8"));
  const flattened = flattenObject(data);
  res.json(flattened);
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 * @description
 * Get the key from request param
 * Convert the key if it is an array index then read the data
 * Get the parent object of the key
 * Return not found if the key is not found
 * If key is array [auth, allowedOrigin, 1]
 * It will delete the item at index 1 of allowedOrigin array
 * If key is not an array, it will delete the key from the parent object
 * return success response
 */
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

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 * @description
 * Get key from param and value form body
 * Convert the key if it is an array index then read the data
 * Get the parent object of the key and the last key
 * If parent is not found or not an object, return error
 * If parent is an array, check if the last key is a valid index
 * If it is, update the value at that index else return error
 * If parent is an object, update the value of the last key exmaple [auth, origin, 1] update auth.origin[1] = value
 * Finally write the updated data back to config.json
 * Return success response
 */
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

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 * @description
 * Get key and value from body. Key, value can be array, object or new item
 * Read data and split the key, example: minio.endPoints -> ['minio', 'endPoints']
 * Loop the find the final key to insert the value
 * If the final key is an array index, push the value to that array
 * If the final key is an object, set the value to that key
 * If the final key is not found, create a new key with the value
 * Write the updated data back to config.json
 * Return success response
 */
export const addConfigItem = async (req, res) => {
  const { key, value } = req.body;

  if (!key || value === undefined) {
    return res.status(400).json({ error: "Key and value are required" });
  }

  const configPath = path.resolve("./config.json");
  const data = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const keys = key.split(/[\.\[\]]/).filter((k) => k !== "");

  let current = data;

  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const nextK = keys[i + 1];
    if (/^\d+$/.test(nextK)) {
      if (!Array.isArray(current[k])) current[k] = [];
      current = current[k];
    } else {
      if (!current[k]) current[k] = {};
      current = current[k];
    }
  }

  const finalKey = keys[keys.length - 1];

  if (/^\d+$/.test(finalKey)) {
    current.push(value);
  } else if (Array.isArray(current)) {
    current.push({ [finalKey]: value });
  } else if (Array.isArray(current[finalKey])) {
    current[finalKey].push(value);
  } else if (
    typeof current[finalKey] === "object" &&
    current[finalKey] !== null
  ) {
    return res
      .status(400)
      .json({ error: "Target is object, not suitable for overwrite" });
  } else {
    current[finalKey] = value;
  }

  fs.writeFileSync(configPath, JSON.stringify(data, null, 2), "utf8");
  res.json({ success: true });
};
