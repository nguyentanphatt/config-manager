export function flattenObject(obj, parentKey = "", result = []) {
  for (const key in obj) {
    const value = obj[key];
    const fullKey = parentKey ? `${parentKey}.${key}` : key;

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          flattenObject(item, `${fullKey}[${index}]`, result);
        } else {
          result.push({
            key: `${fullKey}[${index}]`,
            value: item,
            editable: true,
          });
        }
      });
    } else if (typeof value === "object" && value !== null) {
      if (!parentKey) {
        result.push({
          key: fullKey,
          value: JSON.stringify(value, null, 2),
          editable: false,
        });
      }
      flattenObject(value, fullKey, result);
    } else {
      result.push({
        key: fullKey,
        value,
        editable: true,
      });
    }
  }

  return result;
}
