"use client";
import { fullTypes, getPlaceholderForType } from "@/contants/data";
import { AddFieldFormProps } from "@/contants/type";
import { getValidationError } from "@/lib/validateData";
import { useState } from "react";

const AddFieldForm = ({ onAdd, existingKeys }: AddFieldFormProps) => {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState("number");
  const [errors, setErrors] = useState<{ key?: string; value?: string }>({});

  const validate = () => {
    const errs: { key?: string; value?: string } = {};
    if (existingKeys?.includes(key.trim())) errs.key = "Key đã tồn tại";
    if (!key.trim()) errs.key = "Key không được để trống";
    if (type && type !== "object") {
      if (!value.trim()) errs.value = "Value không được để trống";
      else {
        const err = getValidationError(type, value);
        if (err) errs.value = err;
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const handleAdd = () => {
    if (!validate()) return;
    let parsedValue: any;
    switch (type) {
      case "number":
        parsedValue = parseFloat(value);
        break;
      case "boolean":
        parsedValue = value === "true";
        break;
      default:
        parsedValue = value;
    }
    onAdd(key, parsedValue);
    setKey("");
    setValue("");
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 items-center mt-4">
      <div className="flex gap-2">
        <div className="flex flex-col">
          <input
            className={`border border-gray-300 w-full rounded-md px-2 py-1.5 ${
              errors.key ? "border-red-500" : "border-gray-30"
            }`}
            placeholder="Key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onBlur={validate}
          />
          {errors.key ? (
            <p className="text-xs text-red-500">{errors.key}</p>
          ) : (
            <span className="h-4" />
          )}
        </div>
        <div className="flex flex-col w-[40%]">
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-1.5"
          >
            {fullTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <span className="h-4" />
        </div>
      </div>
      <div className="flex w-full gap-3">
        <div className="flex flex-col w-[70%] md:w-[30%]">
          <input
            className={`border border-gray-300 w-full rounded-md px-2 py-1.5 ${
              errors.value ? "border-red-500" : "border-gray-30"
            }`}
            placeholder={getPlaceholderForType(type)}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={validate}
          />
          {errors.value ? (
            <p className="text-xs text-red-500">{errors.value}</p>
          ) : (
            <span className="h-4" />
          )}
        </div>
        <button
          className="inline-block px-2 py-1 md:px-4 md:py-3 mb-4 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-purple-700 to-pink-500 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs"
          onClick={handleAdd}
        >
          Add Field
        </button>
      </div>
    </div>
  );
};

export default AddFieldForm;
