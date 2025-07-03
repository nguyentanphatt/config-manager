export const getValidationError = (
  type: string,
  value: string
): string | null => {
  if (!value) return null;

  if (type === "number" && isNaN(Number(value))) {
    return "Giá trị không hợp lệ cho kiểu number.";
  }

  if (type === "boolean" && value !== "true" && value !== "false") {
    return "Chỉ được nhập true hoặc false.";
  }

  if (type.startsWith("array<")) {
    try {
      const arr = JSON.parse(value);
      if (!Array.isArray(arr)) return "Phải là mảng JSON hợp lệ.";

      const innerType = type.slice(6, -1);
      for (const item of arr) {
        if (innerType === "number" && typeof item !== "number")
          return "Mảng phải chứa số.";
        if (innerType === "string" && typeof item !== "string")
          return "Mảng phải chứa chuỗi.";
        if (innerType === "boolean" && typeof item !== "boolean")
          return "Mảng phải chứa true/false.";
        if (innerType === "object" && typeof item !== "object")
          return "Mảng phải chứa object.";
      }
    } catch {
      return "Không phải JSON hợp lệ.";
    }
  }

  if (type === "object" || type === "array<object>") {
    try {
      const parsed = JSON.parse(value);
      if (type === "object" && typeof parsed !== "object")
        return "Giá trị phải là object JSON.";
      if (type === "array<object>" && !Array.isArray(parsed))
        return "Giá trị phải là mảng object JSON.";
    } catch {
      return "Không phải JSON hợp lệ.";
    }
  }

  return null;
};
/**
 *
 * @param type
 * @param rawValue
 * @returns
 * Conver value from string to type from select
 */
export const parseValueByType = (type: string, rawValue: string): any => {
  if (type === "number") return Number(rawValue);
  if (type === "boolean") return rawValue === "true";
  if (type.startsWith("array<")) {
    try {
      return JSON.parse(rawValue);
    } catch {
      return [];
    }
  }
  return rawValue;
};
