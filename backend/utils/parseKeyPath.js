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
  const parts = [];

  keyPath.split(".").forEach((segment) => {
    const regex = /([^\[\]]+)|\[(\d+)\]/g;
    let match;
    while ((match = regex.exec(segment)) !== null) {
      parts.push(match[1] ?? match[2]);
    }
  });

  return parts;
}
