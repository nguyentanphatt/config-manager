"use client";
import Header from "@/components/Header";
import RenderObject from "@/components/RenderObject";
import { fetchConfig, fetchConfigBySearchParams } from "@/module/configService";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function Home() {
  const [openKeys, setOpenKeys] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [configData, setConfigData] = useState();
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    setLoading(true);
    try {
      if (search.trim() === "") {
        const response = await fetchConfig();
        setConfigData(response);
      } else {
        const response = await fetchConfigBySearchParams(search);
        setConfigData(response);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);
  return (
    <div className="flex flex-col w-full">
      <Header value={search} onChange={setSearch} />
      <div className="mx-5 lg:mx-0 lg:mr-10 rounded-md border border-gray-300 border-t-0 overflow-x-auto max-h-[82vh] bg-white overflow-y-auto scrollbar-hide">
        <div className="min-w-[650px] overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-600"></div>
            </div>
          ) : (
            <>
              {configData &&
                Object.entries(configData).map(([groupKey, groupValue]) => (
                  <div key={groupKey}>
                    <div className="w-full flex items-center justify-between border border-gray-300 border-l-0 border-r-0 font-bold p-2 mb-2">
                      {groupKey}
                      <div className="w-5 h-5 flex items-center justify-center rounded text-black cursor-pointer">
                        <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
                      </div>
                    </div>
                    <RenderObject
                      data={groupValue}
                      parentKey={groupKey}
                      openKeys={openKeys}
                      setOpenKeys={setOpenKeys}
                      fetchData={fetchData}
                    />
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
