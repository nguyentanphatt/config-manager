import fs from "fs";
import path from "path";
import { flattenObject } from "../utils/flattenObject.js";
import { getNestedTarget } from "../utils/getNestedTarget.js";
import { parseKeyPath } from "../utils/parseKeyPath.js";
import { containsDeepKeyOnly } from "../utils/containsDeepKeyOnly.js";
import { unwrapObjectValues } from "../utils/unwrapObjectValues.js";
/**
 * @description
 * Read data from config.json
 * Return response in json
 */
export const fetchConfig = async (req, res) => {
  const data = JSON.parse(fs.readFileSync("./config.json", "utf8"));
  //const flattened = flattenObject(data);
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

  const keys = parseKeyPath(key); // xử lý "minio.endPoints[0]" nếu cần
  const data = JSON.parse(fs.readFileSync("./config.json", "utf8"));

  // Nếu chỉ là 1 key top-level như "server", "auth", "minio"
  if (keys.length === 1) {
    data[keys[0]] = value;
  } else {
    // xử lý lồng nhau như minio.endPoints[0].port
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

  fs.writeFileSync("./config.json", JSON.stringify(data, null, 2), "utf8");
  res.json({ success: true });
};
/* export const updateConfigItem = async (req, res) => {
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
}; */

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
  const { key, type, value } = req.body;

  if (!key || value === undefined) {
    return res.status(400).json({ error: "Key and value are required" });
  }

  let finalValue = value;

  if (
    typeof type === "string" &&
    type.startsWith("array<") &&
    typeof value === "string"
  ) {
    try {
      finalValue = JSON.parse(value);
      if (!Array.isArray(finalValue)) {
        return res
          .status(400)
          .json({ error: "Value phải là mảng JSON hợp lệ" });
      }
    } catch {
      return res.status(400).json({ error: "Value không phải là JSON hợp lệ" });
    }
  }

  if (
    typeof type === "string" &&
    type === "object" &&
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    finalValue = unwrapObjectValues(value);
  }

  const configPath = path.resolve("./config.json");
  const data = JSON.parse(fs.readFileSync(configPath, "utf8"));

  data[key] = finalValue;

  fs.writeFileSync(configPath, JSON.stringify(data, null, 2), "utf8");
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
  const data = JSON.parse(fs.readFileSync("./config.json", "utf8"));

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

  res.json(filtered);
};

/**
 *
 * @param {*} req
 * @param {*} res
 * Get top level key and return in a array
 * Example: ["server", "auth",...]
 */
export const fetchTopLevelKeys = async (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync("./config.json", "utf8"));
    const topLevelKeys = Object.keys(data);
    res.json(topLevelKeys);
  } catch (error) {
    console.error("Error reading config.json:", error);
    res.status(500).json({ error: "Failed to read config file" });
  }
};

export const fetchConfigByParentKey = async (req, res) => {
  const { parentKey } = req.params;
  const data = JSON.parse(fs.readFileSync("./config.json", "utf8"));

  if (!data.hasOwnProperty(parentKey)) {
    return res.status(404).json({ error: "Parent key not found" });
  }
  return res.json(data[parentKey]);
  //return res.json({ [parentKey]: data[parentKey] });
};
