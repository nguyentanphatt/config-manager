export function getTypeLabel(value: any): string {
  if (Array.isArray(value)) {
    if (value.length === 0) return "array";
    if (typeof value[0] === "object" && value[0] !== null)
      return "array object";
    return `array ${typeof value[0]}`;
  }
  if (value === null) return "null";
  return typeof value;
}
