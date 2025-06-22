export function flattenObject(obj) {
  const result = [];

  for (const key in obj) {
    const value = obj[key];
    if (typeof value === "object") {
      if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === "object") {
          const arrFormatted = value
            .map((item) => JSON.stringify(item))
            .join("\n");
          result.push({ key, value: arrFormatted });
        } else {
          result.push({ key, value: value.join(", ") });
        }
      } else {
        result.push({ key, value: JSON.stringify(value) });
      }
    } else {
      result.push({ key, value });
    }
  }
  return result;
}
