/**
 *
 * @param {*} obj
 * @returns
 * Receive object {type, value} or value to get value
 * Object loop each key to return {type, value}
 * Array loop again to return {type, value} to get value
 */
export function unwrapObjectValues(obj) {
  if (typeof obj === "string") {
    try {
      const parsed = JSON.parse(obj);
      if (typeof parsed === "object" && parsed !== null) {
        return unwrapObjectValues(parsed);
      }
    } catch {}
  }
  if (
    obj &&
    typeof obj === "object" &&
    "value" in obj &&
    Object.keys(obj).length === 2 &&
    "type" in obj
  ) {
    return unwrapObjectValues(obj.value);
  }
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    const result = {};
    for (const k in obj) {
      result[k] = unwrapObjectValues(obj[k]);
    }
    return result;
  }
  if (Array.isArray(obj)) {
    return obj.map(unwrapObjectValues);
  }
  return obj;
}
