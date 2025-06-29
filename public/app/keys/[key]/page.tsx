"use client";
import ConfigForm from "@/components/ConfigForm";
import { EditForm } from "@/components/EditForm";
import Header from "@/components/Header";
import { descriptions } from "@/contants/data";
import { updateNestedValue } from "@/lib/updateNestedValue";
import {
  addConfigData,
  addToExistingKey,
  fetchConfigDataByParentKey,
  updateConfigData,
} from "@/module/configService";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Record<string, any>>({});
  const [addData, setAddData] = useState<any>();
  const [originalData, setOriginalData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const focusKey = searchParams?.get("id") ?? "";
  const edit = searchParams?.has("edit");
  const { key } = useParams();
  const fetchParentData = async () => {
    setLoading(true);
    try {
      const response = await fetchConfigDataByParentKey(String(key ?? ""));
      setData(response);
      setOriginalData(JSON.parse(JSON.stringify(response)));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchParentData();
  }, []);

  const handleChange = (k: string, val: string) => {
    setData((prev) => updateNestedValue(prev, k, val));
  };

  const handleReset = () => {
    setData(JSON.parse(JSON.stringify(originalData)));
    toast.success("Reset successful");
  };

  const handleApply = async () => {
    if (edit) {
      try {
        await addConfigData(String(key), addData);
        await fetchParentData();
        toast.success("Add successful");
        router.push(`/keys/${key}`);
      } catch (error) {
        console.error("Add failed", error);
        toast.error("Add failed");
      }
    } else {
      try {
        await updateConfigData(String(key), data);
        toast.success("Update successful");
      } catch (error) {
        console.error("Update failed", error);
        toast.error("Update failed");
      }
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Header value={search} onChange={setSearch} />
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-600"></div>
        </div>
      ) : (
        <>
          <div className="mx-5 lg:mx-0 lg:mr-10 border border-gray-300 border-t-0 overflow-x-auto max-h-[78vh] bg-white overflow-y-auto scrollbar-hide rounded-md">
            {key && descriptions[String(key)] && (
              <div className="pl-2 lg:pl-4 pt-2 lg:pt-5 text-gray-700 text-base">
                {"*"}
                {descriptions[String(key)]}
              </div>
            )}
            {edit ? (
              <EditForm
                data={data}
                onChange={(newData) => {
                  setAddData(newData);
                }}
              />
            ) : (
              <ConfigForm
                data={data}
                onChange={handleChange}
                focusKey={focusKey}
              />
            )}
          </div>
          <div className="flex gap-2 py-5 justify-end mx-2 lg:mx-0 lg:mr-7">
            <button
              type="button"
              onClick={handleReset}
              className="inline-block px-6 py-3 mr-3 font-bold text-center uppercase align-middle transition-all bg-transparent border rounded-lg cursor-pointer border-red-500 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs text-red-500"
            >
              Reset Default
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="inline-block px-6 py-3 mr-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-purple-700 to-pink-500 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs"
            >
              Apply
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
