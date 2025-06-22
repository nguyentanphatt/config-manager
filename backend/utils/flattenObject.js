/**
 *
 * @param {*} obj
 * @param {*} parentKey
 * @param {*} result
 * @returns result
 * @description
 *  First it loops throught the json object then get the value and the key
 *  Checks if value is an array, loop the array and checks if the item is object or not
 *  If it is an object, it calls the function recursively with the new key
 *  If it is not an object, it pushes the key and value to the result array
 *  If the value is an object, it checks if the parentKey is empty or not
 *  If it is empty, it pushes the key and value to the result array
 *  If it is not empty, it calls the function recursively with the new key
 *  If the value is not an object, it pushes the key and value to the result array
 *  Finally when only have primitive values, it returns the result array
 */
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
