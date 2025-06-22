export function getNestedTarget(obj, keys) {
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const isArrayIndex = /^\d+$/.test(k);

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
