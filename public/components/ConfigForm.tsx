import { ConfigInputProps } from "@/contants/type";
import { getTypeLabel } from "@/lib/getTypeLabel";
import React from "react";

const ConfigForm = ({
  data,
  parentPath = "",
  onChange,
  focusKey,
}: ConfigInputProps) => {
  if (typeof data !== "object" || data === null) {
    console.log("parent", parentPath);

    return (
      <input
        type="text"
        value={String(data)}
        className={`focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none ${
          focusKey
            ? parentPath !== focusKey
              ? "bg-gray-300"
              : "bg-white"
            : "bg-white"
        }`}
        onChange={(e) => {
          const originalType = typeof data;
          let newValue: any = e.target.value;

          if (originalType === "number") {
            const parsed = Number(newValue);
            newValue = isNaN(parsed) ? newValue : parsed;
          } else if (originalType === "boolean") {
            if (newValue.toLowerCase() === "true") newValue = true;
            else if (newValue.toLowerCase() === "false") newValue = false;
          }

          onChange?.(parentPath, newValue);
        }}
        ref={(el) => {
          if (parentPath === focusKey && el) {
            el.focus();
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }}
        disabled={focusKey ? parentPath !== focusKey : false}
      />
    );
  }

  if (Array.isArray(data)) {
    return (
      <div className="pl-4">
        {data.map((item, idx) => (
          <div key={idx}>
            <label className="font-medium">[{idx}]</label>
            <ConfigForm
              data={item}
              parentPath={`${parentPath}[${idx}]`}
              onChange={onChange}
              focusKey={focusKey}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4 space-y-4">
      {Object.entries(data).map(([key, value]) => {
        const fullKey = parentPath ? `${parentPath}.${key}` : key;
        return (
          <div key={fullKey} className="flex flex-col gap-2">
            <label className="font-medium">
              {key}{" "}
              <span className="text-xs text-gray-500">
                ({getTypeLabel(value)})
              </span>
            </label>
            <ConfigForm
              data={value}
              parentPath={fullKey}
              onChange={onChange}
              focusKey={focusKey}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ConfigForm;
