"use client";
import { useState } from "react";

type JsonValue =
  | string
  | number
  | boolean
  | JsonValue[]
  | { [key: string]: JsonValue };

type JsonEditorProps = {
  data: JsonValue;
  onChange: (data: JsonValue) => void;
};

const isObject = (val: any) =>
  typeof val === "object" && !Array.isArray(val) && val !== null;

export default function JsonEditor({ data, onChange }: JsonEditorProps) {
  const handleChange = (key: string | number, value: JsonValue) => {
    if (Array.isArray(data)) {
      const newArr = [...data];
      newArr[key as number] = value;
      onChange(newArr);
    } else if (isObject(data)) {
      const newObj = { ...(data as any), [key]: value };
      onChange(newObj);
    }
  };

  const handleAdd = () => {
    if (Array.isArray(data)) {
      onChange([...data, ""]);
    } else if (isObject(data)) {
      onChange({ ...(data as any), newKey: "" });
    }
  };

  const handleRemove = (key: string | number) => {
    if (Array.isArray(data)) {
      const newArr = [...data];
      newArr.splice(key as number, 1);
      onChange(newArr);
    } else if (isObject(data)) {
      const newObj = { ...(data as any) };
      delete newObj[key as string];
      onChange(newObj);
    }
  };

  return (
    <div className="flex flex-col gap-2 border p-3 rounded bg-gray-50">
      {Array.isArray(data) &&
        data.map((item, index) => (
          <div key={index} className="flex gap-2 items-start">
            <JsonEditor
              data={item}
              onChange={(val) => handleChange(index, val)}
            />
            <button
              onClick={() => handleRemove(index)}
              className="text-red-500"
            >
              ✕
            </button>
          </div>
        ))}

      {isObject(data) &&
        Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex gap-2 items-start">
            <input
              className="border px-2 py-1 rounded w-32"
              value={key}
              onChange={(e) => {
                const newKey = e.target.value;
                const temp = { ...(data as any) };
                temp[newKey] = temp[key];
                delete temp[key];
                onChange(temp);
              }}
            />
            <JsonEditor
              data={value}
              onChange={(val) => handleChange(key, val)}
            />
            <button onClick={() => handleRemove(key)} className="text-red-500">
              ✕
            </button>
          </div>
        ))}

      {typeof data === "string" ||
      typeof data === "number" ||
      typeof data === "boolean" ? (
        <input
          className="border px-2 py-1 rounded w-full"
          value={String(data)}
          onChange={(e) => {
            const raw = e.target.value;
            let val: any = raw;
            if (!isNaN(Number(raw))) val = Number(raw);
            else if (raw === "true") val = true;
            else if (raw === "false") val = false;
            onChange(val);
          }}
        />
      ) : null}

      <button
        onClick={handleAdd}
        className="text-blue-500 hover:underline self-start"
      >
        + Add {Array.isArray(data) ? "Item" : "Key"}
      </button>
    </div>
  );
}
