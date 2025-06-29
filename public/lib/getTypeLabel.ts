/**
 *
 * @param value
 * @returns
 * Receive value and check type to show
 */
export function getTypeLabel(value: any): string {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return getTypeLabel(parsed);
    } catch {}
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "array";
    const types = Array.from(
      new Set(
        value.map((v) =>
          v === null ? "null" : typeof v === "object" ? "object" : typeof v
        )
      )
    );
    if (types.length === 1) {
      return `array ${types[0]}`;
    }
    return `array [${types.join(", ")}]`;
  }
  if (value === null) return "null";
  return typeof value;
}
