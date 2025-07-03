/**
 *
 * @param {*} obj //Key or Value in json
 * @param {*} search //Search query
 * @returns
 * @description
 * Help to search for complicated json
 * Help search in array, object,...
 */
export function containsDeepKeyOnly(obj, search) {
  if (typeof obj !== "object" || obj === null) return false;

  if (Array.isArray(obj)) {
    return obj.some((item) => containsDeepKeyOnly(item, search));
  }

  return Object.entries(obj).some(([key, value]) => {
    return (
      key.toLowerCase().includes(search) || containsDeepKeyOnly(value, search)
    );
  });
}
