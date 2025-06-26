"use client";
import Header from "@/components/Header";
import RenderObject from "@/components/RenderObject";
import { fetchConfig, fetchConfigBySearchParams } from "@/module/configService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [openKeys, setOpenKeys] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [configData, setConfigData] = useState();
  const router = useRouter();
  const fetchData = async () => {
    if (search.trim() === "") {
      const response = await fetchConfig();
      setConfigData(response);
    } else {
      const response = await fetchConfigBySearchParams(search);
      setConfigData(response);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);
  return (
    <div className="flex flex-col w-full">
      <Header value={search} onChange={setSearch} />
      <div className="mx-5 lg:mx-0 lg:mr-10 border border-gray-300 border-t-0 overflow-x-auto max-h-[82vh] bg-white overflow-y-auto scrollbar-hide">
        <div className="min-w-[650px] overflow-x-auto">
          {configData &&
            Object.entries(configData).map(([groupKey, groupValue]) => (
              <div key={groupKey}>
                <h2 className="w-full border border-gray-300 border-l-0 border-r-0 font-bold p-2 mb-2">
                  {groupKey}
                </h2>
                <RenderObject
                  data={groupValue}
                  parentKey={groupKey}
                  openKeys={openKeys}
                  setOpenKeys={setOpenKeys}
                  fetchData={fetchData}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
