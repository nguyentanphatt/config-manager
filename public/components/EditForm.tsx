"use client";
import React, { useState } from "react";
import AddFieldForm from "./AddFieldForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { getTypeLabel } from "@/lib/getTypeLabel";
import { EditFormProps } from "@/contants/type";

export const EditForm = ({ data, onChange }: EditFormProps) => {
  const [formData, setFormData] = useState<any>(structuredClone(data));
  const [showAddField, setShowAddField] = useState(false);
  const [newFields, setNewFields] = useState<string[]>([]);
  const handleChange = (key: string, value: any) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    onChange(updated);
  };

  const handleAddField = (key: string, value: any) => {
    if (!key) return;
    handleChange(key, value);
    setNewFields([...newFields, key]);
  };

  const renderField = (key: string, value: any) => {
    if (typeof value === "object" && !Array.isArray(value) && value !== null) {
      return (
        <div key={key} className=" p-2 my-2">
          <strong>{key} (object)</strong>
          <EditForm
            data={value as any}
            onChange={(newVal) => handleChange(key, newVal)}
          />
        </div>
      );
    } else if (Array.isArray(value)) {
      return (
        <div key={key} className="border p-2 my-2">
          <strong>{key} (array)</strong>
          {value.map((v, idx) => {
            return (
              <div key={idx} className="my-1">
                {typeof v === "object" && v !== null ? (
                  <div className="border p-2 bg-gray-50">
                    {Object.entries(v).map(([subKey, subVal]) => (
                      <div key={subKey} className="mb-2">
                        <label className="block mb-2">
                          {subKey}{" "}
                          <span className="text-base text-gray-500">
                            ({getTypeLabel(subVal)})
                          </span>
                        </label>
                        <input
                          className="border px-2 py-1 w-full bg-gray-200 rounded-md"
                          value={String(subVal)}
                          onChange={(e) => {
                            const updated = [...value];
                            updated[idx] = {
                              ...JSON.parse(JSON.stringify(v)),
                              [subKey]: e.target.value,
                            };
                            handleChange(key, updated);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <input
                    className={`border px-2 py-1 w-full rounded-md mb-3`}
                    value={String(v)}
                    onChange={(e) => {
                      const updated = [...value];
                      updated[idx] = e.target.value;
                      handleChange(key, updated);
                    }}
                  />
                )}
              </div>
            );
          })}
          <button
            className="inline-block px-4 py-3 mr-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-purple-700 to-pink-500 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs"
            onClick={() => {
              const newItem = "";
              handleChange(key, [...value, newItem]);
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      );
    } else {
      // Primitive
      return (
        <div key={key} className="my-2 flex flex-col gap-2">
          <label className="block  font-medium">
            {key}{" "}
            <span className="text-xs text-gray-500">
              ({getTypeLabel(value)})
            </span>
          </label>
          <div className="flex gap-2">
            <input
              className={`border px-2 py-1 w-full rounded-md ${
                !newFields.includes(key) ? "bg-gray-200" : "bg-white"
              }`}
              value={value as string}
              onChange={(e) => handleChange(key, e.target.value)}
              disabled={!newFields.includes(key)}
            />
            {newFields.includes(key) && (
              <button
                className="text-white cursor-pointer bg-red-500 w-9 h-9 rounded-md"
                onClick={() => {
                  const updated = { ...formData };
                  delete updated[key];
                  setFormData(updated);
                  setNewFields(newFields.filter((f) => f !== key));
                  onChange(updated);
                }}
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="p-4">
      {Object.entries(formData).map(([key, value]) => renderField(key, value))}
      {showAddField ? (
        <AddFieldForm
          onAdd={(key, val) => {
            handleAddField(key, val);
            setShowAddField(false);
          }}
          existingKeys={Object.keys(data)}
        />
      ) : (
        <button
          className="inline-block px-4 py-3 mr-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-purple-700 to-pink-500 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs"
          onClick={() => setShowAddField(true)}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      )}
    </div>
  );
};
