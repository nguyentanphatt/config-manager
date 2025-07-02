/**
 *
 * @param obj
 * @param path
 * @param value
 * @returns
 * Convert and update value of nested json. Example:"arr[0].name" -> obj.arr[0].name = value
 * updateNestedValue(config, "minio.endPoints[1].port", 9999) -> update value of minio.endPoints[1].port = 9999
 */
export function updateNestedValue(obj: any, path: string, value: any): any {
  const keys = path.replace(/\[(\d+)\]/g, ".$1").split(".");

  const newObj = { ...obj };

  let current = newObj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (!(k in current)) current[k] = {};
    current[k] = Array.isArray(current[k])
      ? [...current[k]]
      : { ...current[k] };
    current = current[k];
  }

  current[keys[keys.length - 1]] = value;
  return newObj;
}
