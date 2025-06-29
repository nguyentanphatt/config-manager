"use client";
import Header from "@/components/Header";
import { fullTypes, getPlaceholderForType } from "@/contants/data";
import { ObjectField } from "@/contants/type";
import { getValidationError, parseValueByType } from "@/lib/validateData";
import { addConfigData, fetchTopKeyConfig } from "@/module/configService";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const [mainKey, setMainKey] = useState("");
  const [selectedType, setSelectedType] = useState("number");
  const [mainValue, setMainValue] = useState("");
  const [objectFields, setObjectFields] = useState<ObjectField[]>([]);
  const [mainKeyError, setMainKeyError] = useState<string | null>(null);
  const [mainTypeError, setMainTypeError] = useState<string | null>(null);
  const [mainValueError, setMainValueError] = useState<string | null>(null);
  const [objectFieldErrors, setObjectFieldErrors] = useState<
    Record<number, { key?: string; type?: string; value?: string }>
  >({});
  const [topkey, setTopkey] = useState<string[]>([]);
  const handleAddObjectField = () => {
    setObjectFields((prev) => [
      ...prev,
      { id: Date.now(), key: "", type: "", value: "" },
    ]);
  };

  const handleRemoveObjectField = (id: number) => {
    setObjectFields((prev) => prev.filter((field) => field.id !== id));
  };

  const updateField = (
    id: number,
    fieldName: "key" | "type" | "value",
    value: string
  ) => {
    setObjectFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [fieldName]: value } : f))
    );
  };

  useEffect(() => {
    if (selectedType !== "object") {
      setObjectFields([]);
    } else if (objectFields.length === 0) {
      handleAddObjectField();
    }
  }, [selectedType]);

  const fetchTopKey = async () => {
    const response = await fetchTopKeyConfig();
    setTopkey(response);
  };

  useEffect(() => {
    fetchTopKey();
  }, []);

  const generateOutput = () => {
    if (!mainKey || !selectedType) return null;

    if (selectedType !== "object") {
      let finalValue: any = mainValue;
      if (selectedType === "number") finalValue = Number(mainValue);
      else if (selectedType === "boolean") finalValue = mainValue === "true";
      return {
        key: mainKey,
        type: selectedType,
        value: finalValue,
      };
    }

    const objectValue: Record<string, any> = {};
    objectFields.forEach((field) => {
      if (field.key?.trim() && field.type?.trim()) {
        objectValue[field.key] = {
          type: field.type,
          value: parseValueByType(field.type, field.value),
        };
      }
    });
    return {
      key: mainKey,
      type: "object",
      value: objectValue,
    };
  };

  const validateAll = () => {
    let valid = true;

    if (!mainKey.trim()) {
      setMainKeyError("Key không được để trống");
      valid = false;
    } else if (topkey.includes(mainKey.trim())) {
      setMainKeyError("Key đã tồn tại");
      valid = false;
    } else {
      setMainKeyError(null);
    }

    if (!selectedType) {
      setMainTypeError("Phải chọn type");
      valid = false;
    } else {
      setMainTypeError(null);
    }

    if (selectedType && selectedType !== "object") {
      if (!mainValue.trim()) {
        setMainValueError("Value không được để trống");
        valid = false;
      } else {
        const err = getValidationError(selectedType, mainValue);
        if (err) {
          setMainValueError(err);
          valid = false;
        } else {
          setMainValueError(null);
        }
      }
    } else {
      setMainValueError(null);
    }

    if (selectedType === "object") {
      const errors: Record<
        number,
        { key?: string; type?: string; value?: string }
      > = {};
      objectFields.forEach((field) => {
        const fieldErr: { key?: string; type?: string; value?: string } = {};
        if (!field.key.trim()) {
          fieldErr.key = "Sub key không được để trống";
          valid = false;
        }
        if (!field.type) {
          fieldErr.type = "Phải chọn type";
          valid = false;
        }
        if (field.type && !field.value.trim()) {
          fieldErr.value = "Value không được để trống";
          valid = false;
        } else if (field.type && field.value.trim()) {
          const err = getValidationError(field.type, field.value);
          if (err) {
            fieldErr.value = err;
            valid = false;
          }
        }
        if (Object.keys(fieldErr).length > 0) {
          errors[field.id] = fieldErr;
        }
      });
      setObjectFieldErrors(errors);
    } else {
      setObjectFieldErrors({});
    }

    return valid;
  };

  const handleAddConfig = async () => {
    if (!validateAll()) return;
    const data = generateOutput();
    console.log(data);

    if (!data) return;
    try {
      await addConfigData(data.key, data.value);
      toast.success("Add config successful!");
    } catch (error) {
      toast.error("Error: " + error);
    }
  };
  return (
    <div className="flex flex-col w-full">
      <Header />
      <div className="h-auto mx-5 lg:mx-0 lg:mr-10 border border-gray-300 border-t-0 overflow-x-auto max-h-[78vh] bg-white overflow-y-auto scrollbar-hide rounded-md">
        <div className="flex items-start gap-2 p-2 md:p-3">
          <div className="flex flex-col md:flex-row md:gap-2 w-full">
            <div className="flex w-full md:w-[50%] gap-2">
              <div className="flex flex-col w-[60%]">
                <div className="flex items-center gap-2">
                  <label htmlFor="type" className="font-medium text-gray-700">
                    Key
                  </label>
                  <input
                    type="text"
                    value={mainKey}
                    onChange={(e) => setMainKey(e.target.value)}
                    className={`w-full focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block appearance-none rounded-lg border border-solid  bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none ${
                      mainKeyError ? "border-red-500" : "border-gray-300"
                    }`}
                    onBlur={() => {
                      if (!mainKey.trim()) {
                        setMainKeyError("Key không được để trống");
                      } else if (topkey.includes(mainKey.trim())) {
                        setMainKeyError("Key đã tồn tại");
                      } else {
                        setMainKeyError(null);
                      }
                    }}
                  />
                </div>
                {mainKeyError ? (
                  <p className="text-xs text-red-500 pl-9">{mainKeyError}</p>
                ) : (
                  <span className="h-4" />
                )}
              </div>
              <div className="flex flex-col w-[40%]">
                <select
                  id="type"
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    setMainValue("");
                    setMainValueError("");
                  }}
                  className="border border-gray-300 rounded-md px-3 py-1.5"
                >
                  <option value="">type</option>
                  {fullTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {mainTypeError ? (
                  <p className="text-xs text-red-500">{mainTypeError}</p>
                ) : (
                  <span className="h-4" />
                )}
              </div>
            </div>
            <div className="flex flex-col w-full md:w-[30%]">
              {selectedType &&
                selectedType !== "object" &&
                selectedType !== "boolean" && (
                  <input
                    type="text"
                    placeholder={getPlaceholderForType(selectedType)}
                    value={mainValue}
                    onChange={(e) => setMainValue(e.target.value)}
                    className={`w-full focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block appearance-none rounded-lg border border-solid border-gray-300 bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none`}
                    onBlur={() => {
                      if (!mainValue.trim())
                        setMainValueError("Value không được để trống");
                      else {
                        const err = getValidationError(selectedType, mainValue);
                        setMainValueError(err || null);
                      }
                    }}
                  />
                )}
              {selectedType === "boolean" && (
                <select
                  onChange={(e) => setMainValue(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5"
                >
                  <option value="">-- chọn --</option>
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
              )}
              {mainValueError ? (
                <p className="text-xs text-red-500">{mainValueError}</p>
              ) : (
                <span className="h-4" />
              )}
            </div>
          </div>
        </div>

        {selectedType === "object" && (
          <div className="pl-2 md:pl-6 flex flex-col gap-2">
            {objectFields.map((field, idx) => {
              return (
                <div key={field.id} className="flex flex-col gap-1">
                  <div className="flex items-start gap-2">
                    <div className="flex flex-col md:flex-row md:gap-2 w-full">
                      <div className="flex w-full md:w-[50%] gap-2">
                        <div className="flex flex-col w-[70%]">
                          <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-700 w-[40%]">
                              Sub Key {idx + 1}
                            </label>

                            <input
                              type="text"
                              value={field.key}
                              onChange={(e) =>
                                updateField(field.id, "key", e.target.value)
                              }
                              className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-700 ${
                                objectFieldErrors[field.id]?.key
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder={`Sub Key ${idx + 1}`}
                              onBlur={() => {
                                setObjectFieldErrors((prev) => ({
                                  ...prev,
                                  [field.id]: {
                                    ...prev[field.id],
                                    key: !field.key.trim()
                                      ? `Sub key ${idx + 1} không được để trống`
                                      : undefined,
                                  },
                                }));
                              }}
                            />
                          </div>
                          {objectFieldErrors[field.id]?.key ? (
                            <p className="text-xs text-red-500">
                              {objectFieldErrors[field.id]?.key}
                            </p>
                          ) : (
                            <span className="h-4" />
                          )}
                        </div>

                        <div className="flex flex-col w-[30%]">
                          <select
                            value={field.type}
                            onChange={(e) => {
                              updateField(field.id, "type", e.target.value);
                              setObjectFieldErrors((prev) => ({
                                ...prev,
                                [field.id]: {
                                  ...prev[field.id],
                                  type: undefined,
                                  value: undefined,
                                },
                              }));
                            }}
                            className="border border-gray-300 rounded-md px-3 py-1.5"
                          >
                            <option value="">type</option>
                            {fullTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                          {objectFieldErrors[field.id]?.type ? (
                            <p className="text-xs text-red-500">
                              {objectFieldErrors[field.id]?.type}
                            </p>
                          ) : (
                            <span className="h-4" />
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {field.type ? (
                          <div className="flex flex-col w-[85%]">
                            {(field.type && field.type === "object") ||
                            field.type === "array<object>" ? (
                              <textarea
                                value={field.value}
                                onChange={(e) =>
                                  updateField(field.id, "value", e.target.value)
                                }
                                placeholder={
                                  field.type === "object"
                                    ? 'eg. {"a": 1, "b": "xyz"}'
                                    : 'eg. [{"a": 1, "b": "xyz"}, {"a": 2, "b": "abc"}]'
                                }
                                className={`resize-none w-full h-[80px] rounded-lg border ${
                                  objectFieldErrors[field.id]?.value
                                    ? "border-red-500"
                                    : "border-gray-300"
                                } px-3 py-2 text-sm text-gray-700`}
                                onBlur={() => {
                                  setObjectFieldErrors((prev) => ({
                                    ...prev,
                                    [field.id]: {
                                      ...prev[field.id],
                                      value: !field.value.trim()
                                        ? "Value không được để trống"
                                        : getValidationError(
                                            field.type,
                                            field.value
                                          ) || undefined,
                                    },
                                  }));
                                }}
                              />
                            ) : field.type === "boolean" ? (
                              <select
                                value={field.value}
                                onChange={(e) =>
                                  updateField(field.id, "value", e.target.value)
                                }
                                className={`w-full rounded-lg border ${
                                  objectFieldErrors[field.id]?.type
                                    ? "border-red-500"
                                    : "border-gray-300"
                                } px-3 py-2 text-sm text-gray-700`}
                              >
                                <option value="">-- chọn --</option>
                                <option value="true">true</option>
                                <option value="false">false</option>
                              </select>
                            ) : field.type ? (
                              <input
                                type="text"
                                placeholder={getPlaceholderForType(field.type)}
                                value={field.value}
                                onChange={(e) =>
                                  updateField(field.id, "value", e.target.value)
                                }
                                className={`w-full rounded-lg border ${
                                  objectFieldErrors[field.id]?.value
                                    ? "border-red-500"
                                    : "border-gray-300"
                                } px-3 py-2 text-sm text-gray-700`}
                                onBlur={() => {
                                  setObjectFieldErrors((prev) => ({
                                    ...prev,
                                    [field.id]: {
                                      ...prev[field.id],
                                      value: !field.value.trim()
                                        ? "Value không được để trống"
                                        : getValidationError(
                                            field.type,
                                            field.value
                                          ) || undefined,
                                    },
                                  }));
                                }}
                              />
                            ) : null}
                            {objectFieldErrors[field.id]?.value ? (
                              <p className="text-xs text-red-500">
                                {objectFieldErrors[field.id]?.value}
                              </p>
                            ) : (
                              <span className="h-4" />
                            )}
                          </div>
                        ) : null}

                        <button
                          onClick={() => handleRemoveObjectField(field.id)}
                          className="text-white cursor-pointer bg-red-500 w-9 h-9 rounded-md"
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div
              onClick={handleAddObjectField}
              className="mb-4 w-9 h-9 flex items-center justify-center p-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-purple-700 to-pink-500 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs"
            >
              <FontAwesomeIcon
                icon={faPlus}
                className=" text-white"
                size="xl"
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2 py-5 justify-end mx-2 lg:mx-0 lg:mr-7">
        <button
          type="button"
          onClick={handleAddConfig}
          className="inline-block px-6 py-3 mr-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-purple-700 to-pink-500 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default Page;
