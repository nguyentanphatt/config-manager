export function parseKeyPath(keyPath) {
  return keyPath.replace(/\[(\d+)\]/g, ".$1").split(".");
}
