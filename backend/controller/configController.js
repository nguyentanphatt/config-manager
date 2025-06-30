import fs from "fs";
import path from "path";
import { getNestedTarget } from "../utils/getNestedTarget.js";
import { parseKeyPath } from "../utils/parseKeyPath.js";
import { containsDeepKeyOnly } from "../utils/containsDeepKeyOnly.js";
import { unwrapObjectValues } from "../utils/unwrapObjectValues.js";
import { decrypt, encrypt } from "../utils/cryptoConfig.js";
import { saveBackup } from "../utils/saveBackup.js";
/**
 * @description
 * Read data from config.json
 * Return response in json
 */
export const fetchConfig = async (req, res) => {
  const encrypted = fs.readFileSync("./config.json", "utf8");
  const data = JSON.parse(decrypt(encrypted));
  res.json(data);
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 * @description
 * Get the key from request param
 * Convert the key by getKeyPath
 * Delete parent[key]
 * Continue check if parent key and grand parent key (case: object in array, array in array)
 * If parent is array and null then delete it
 * Else parent is object then check grandparent. If grandparent is array then delete th child object when null util all child is null then remove grandparent
 * If parent is object or array just remove it when it null
 */

export const deleteConfigItem = async (req, res) => {
  const { key } = req.params;

  if (!key) {
    return res.status(400).json({ error: "Key are required" });
  }

  const keys = parseKeyPath(key);
  const encrypted = fs.readFileSync("./config.json", "utf8");

  saveBackup(encrypted);

  const data = JSON.parse(decrypt(encrypted));

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

  if (keys.length > 1) {
    const parentKeys = keys.slice(0, -1);
    const grandParent = getNestedTarget(data, parentKeys);
    const parentKey = parentKeys[parentKeys.length - 1];
    if (Array.isArray(parent)) {
      if (parent.length === 0) {
        if (Array.isArray(grandParent)) {
          const idx = parseInt(parentKey);
          if (!isNaN(idx) && idx < grandParent.length) {
            grandParent.splice(idx, 1);
          }
        } else if (grandParent && typeof grandParent === "object") {
          delete grandParent[parentKey];
        }
      }
    } else if (grandParent && Array.isArray(grandParent)) {
      const idx = parseInt(parentKey);
      if (
        !isNaN(idx) &&
        typeof parent === "object" &&
        parent !== null &&
        Object.keys(parent).length === 0
      ) {
        grandParent.splice(idx, 1);
        const greatGrandParent = getNestedTarget(data, parentKeys.slice(0, -1));
        const greatGrandParentKey =
          parentKeys.length > 1 ? parentKeys[parentKeys.length - 2] : null;
        if (
          grandParent.length === 0 &&
          greatGrandParent &&
          typeof greatGrandParent === "object" &&
          greatGrandParentKey
        ) {
          delete greatGrandParent[greatGrandParentKey];
        }
      }
    } else if (grandParent && typeof grandParent === "object") {
      if (
        parent &&
        typeof parent === "object" &&
        !Array.isArray(parent) &&
        Object.keys(parent).length === 0
      ) {
        delete grandParent[parentKey];
      }
      if (Array.isArray(parent) && parent.length === 0) {
        delete grandParent[parentKey];
      }
    }
  }
  const encryptedResult = encrypt(JSON.stringify(data, null, 2));
  fs.writeFileSync("./config.json", encryptedResult, "utf8");
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

  const keys = parseKeyPath(key); // xử lý "minio.endPoints[0]" nếu cần

  const encrypted = fs.readFileSync("./config.json", "utf8");

  saveBackup(encrypted);

  const data = JSON.parse(decrypt(encrypted));
  if (keys.length === 1) {
    data[keys[0]] = value;
  } else {
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
  }
  const encryptedResult = encrypt(JSON.stringify(data, null, 2));
  fs.writeFileSync("./config.json", encryptedResult, "utf8");
  res.json({ success: true });
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 * @description
 * Receive key, type, value. Value can be an object
 * If value is normal like number, string,... add to json
 * If value is type with array<string | number | ...> convert to json then add
 * If value is object with many subkey, subtype, subvalue then use unwrapObject to get value
 */

export const addConfigItem = async (req, res) => {
  const { key, value } = req.body;
  if (!key || value === undefined) {
    return res.status(400).json({ error: "Key and value are required" });
  }

  const encrypted = fs.readFileSync("./config.json", "utf8");

  saveBackup(encrypted);

  const data = JSON.parse(decrypt(encrypted));

  data[key] = unwrapObjectValues(value);

  const encryptedResult = encrypt(JSON.stringify(data, null, 2));
  fs.writeFileSync("./config.json", encryptedResult, "utf8");
  res.json({ success: true });
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 * @description
 * Receive a Key and filter from data to get json
 */
export const fetchConfigItemByKey = async (req, res) => {
  const { key } = req.params;
  const search = key?.toLowerCase();
  const encrypted = fs.readFileSync("./config.json", "utf8");
  const data = JSON.parse(decrypt(encrypted));

  if (!search) return res.json(data);

  const filtered = Object.entries(data)
    .filter(([groupKey, groupValue]) => {
      return (
        groupKey.toLowerCase().includes(search) ||
        containsDeepKeyOnly(groupValue, search)
      );
    })
    .reduce((acc, [k, v]) => {
      acc[k] = v;
      return acc;
    }, {});

  if (Object.keys(filtered).length === 0) {
    return res.status(404).json({ error: "No matching key found" });
  }

  return res.json(filtered);
};

/**
 *
 * @param {*} req
 * @param {*} res
 * Get top level key and return in a array
 * Example: ["server", "auth",...]
 */
export const fetchTopLevelKeys = async (req, res) => {
  const encrypted = fs.readFileSync("./config.json", "utf8");
  const data = JSON.parse(decrypt(encrypted));
  const topLevelKeys = Object.keys(data);
  return res.json(topLevelKeys);
};

export const fetchConfigByParentKey = async (req, res) => {
  const { parentKey } = req.params;
  const encrypted = fs.readFileSync("./config.json", "utf8");
  const data = JSON.parse(decrypt(encrypted));

  if (!data.hasOwnProperty(parentKey)) {
    return res.status(404).json({ error: "Parent key not found" });
  }
  return res.json(data[parentKey]);
};

export const getBackups = async (req, res) => {
  try {
    const files = fs
      .readdirSync("./logs")
      .filter((f) => f.endsWith("_config.json"))
      .map((f) => {
        const datePart = f.slice(0, 8);
        const timePart = f.slice(9, 15);

        const formattedDate = `${datePart.slice(6, 8)}/${datePart.slice(
          4,
          6
        )}/${datePart.slice(0, 4)}`;
        const formattedTime = `${timePart.slice(0, 2)}:${timePart.slice(
          2,
          4
        )}:${timePart.slice(4, 6)}`;

        return {
          filename: f,
          time: `${formattedDate} ${formattedTime}`,
        };
      });

    return res.json(files);
  } catch (error) {
    return res.status(404).json({ error: "Can't get backups" });
  }
};

export const getBackupsDetail = async (req, res) => {
  const { filename } = req.params;

  if (!filename) {
    return res.status(400).json({ error: "Filename is required" });
  }

  const filepath = path.join("./logs", filename);

  if (fs.existsSync(filepath)) {
    const encrypted = fs.readFileSync(filepath, "utf8");
    const data = JSON.parse(decrypt(encrypted));
    return res.json(data);
  } else {
    return res.status(404).json({ error: "Not found file data" });
  }
};

export const rollbackBackup = async (req, res) => {
  const { filename } = req.params;

  if (!filename) {
    return res.status(400).json({ error: "Filename is required" });
  }

  const currentData = fs.readFileSync("./config.json", "utf8");

  const filepath = path.join("./logs", filename);
  const backupData = fs.readFileSync(filepath, "utf-8");

  saveBackup(currentData);

  fs.writeFileSync("./config.json", backupData, "utf8");

  return res.json({
    success: true,
  });
};
