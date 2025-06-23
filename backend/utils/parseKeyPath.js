/**
 *
 * @param {*} keyPath
 * @returns
 * @description
 * For keyPath like minio.endPoints%5B0%5D.test because of the URL encoding
 * It decodes the URL encoding first
 * It replaces the array index notation with dot notation and splits the string into an array of keys
 * Result minio.endPoints[0].test becomes ["minio", "endPoints", "0", "test"]
 */

export function parseKeyPath(keyPath) {
  return keyPath.replace(/\[(\d+)\]/g, ".$1").split(".");
}
