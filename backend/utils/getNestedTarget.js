/**
 *
 * @param {*} obj
 * @param {*} keys
 * @returns
 * @description
 *  For some key like auth.allowedOrigin[1],...
 *  Loops through the keys array and checks if the current key is an array index or not
 *  If it is an array index, it checks if the current object is an array and if the index is valid
 *  If it is not an array index, it checks if the current object is an object
 *  If it is an object, it checks if the key exists in the object
 *  If the key exists, it updates the current object to the value of the key
 */
export function getNestedTarget(obj, keys) {
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];

    if (Array.isArray(current)) {
      const index = parseInt(k);
      if (index >= current.length || index < 0) return null;
      current = current[index];
    } else if (current && k in current) {
      current = current[k];
    } else {
      return null;
    }
  }

  return current;
}
