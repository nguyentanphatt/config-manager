/**
 *
 * @param {*} obj
 * @returns
 * Receive object {type, value} to get value
 * Object loop each key to return {type, value}
 * Array loop again to return {type, value} to get value
 */
/* export function unwrapObjectValues(obj) {
  // Nếu là object dạng { type, value }, trả về value
  if (
    obj &&
    typeof obj === "object" &&
    "value" in obj &&
    Object.keys(obj).length === 2 &&
    "type" in obj
  ) {
    return unwrapObjectValues(obj.value);
  }
  // Nếu là object thường, duyệt từng key
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    const result = {};
    for (const k in obj) {
      result[k] = unwrapObjectValues(obj[k]);
    }
    return result;
  }
  // Nếu là array, duyệt từng phần tử
  if (Array.isArray(obj)) {
    return obj.map(unwrapObjectValues);
  }
  // Nếu là giá trị thường
  return obj;
} */

export function unwrapObjectValues(obj) {
  // Nếu là string có thể parse thành JSON, unwrap tiếp
  if (typeof obj === "string") {
    try {
      const parsed = JSON.parse(obj);
      if (typeof parsed === "object" && parsed !== null) {
        return unwrapObjectValues(parsed);
      }
    } catch {
      // Không phải JSON, trả về nguyên giá trị
    }
  }
  // Nếu là object dạng { type, value }, trả về value
  if (
    obj &&
    typeof obj === "object" &&
    "value" in obj &&
    Object.keys(obj).length === 2 &&
    "type" in obj
  ) {
    return unwrapObjectValues(obj.value);
  }
  // Nếu là object thường, duyệt từng key
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    const result = {};
    for (const k in obj) {
      result[k] = unwrapObjectValues(obj[k]);
    }
    return result;
  }
  // Nếu là array, duyệt từng phần tử
  if (Array.isArray(obj)) {
    return obj.map(unwrapObjectValues);
  }
  // Nếu là giá trị thường
  return obj;
}
