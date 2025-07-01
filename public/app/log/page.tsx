"use client";
import BackupTable from "@/components/BackupTable";
import Header from "@/components/Header";
import {
  fetchBackup,
  fetchBackupDetail,
  rollback,
} from "@/module/configService";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const [backupList, setBackupList] = useState<
    { filename: string; time: string }[]
  >([]);
  const [openKeys, setOpenKeys] = useState<Record<string, boolean>>({});
  const [backupData, setBackupData] = useState<any>();
  const [selectedFilename, setSelectedFilename] = useState<string>();
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const router = useRouter();
  const fetchBackupData = async () => {
    const res = await fetchBackup();
    setBackupList(res ?? []);
  };
  useEffect(() => {
    fetchBackupData();
  }, []);

  const handleBackupDetail = async (filename: string) => {
    setSelectedFilename(filename);
    const res = await fetchBackupDetail(filename);
    setBackupData(res);
  };

  const handleRollback = async (filename: string) => {
    const res = await rollback(filename);
    if (res) {
      toast.success("Rollback successful!");
      router.push("/");
    } else {
      toast.error("Something wrong!");
    }
  };

  const filteredBackupList = backupList.filter(
    (item) =>
      item.filename.toLowerCase().includes(search.toLowerCase()) ||
      item.time.toLowerCase().includes(search.toLowerCase())
  );
  const sortedBackupList = [...filteredBackupList].sort((a, b) => {
    if (sortAsc) {
      return a.filename.localeCompare(b.filename);
    } else {
      return b.filename.localeCompare(a.filename);
    }
  });
  return (
    <div className="flex flex-col w-full">
      <Header value={search} onChange={setSearch} />
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex flex-col gap-3 w-full md:max-w-[250px]">
          <div className="flex items-center justify-between mb-2 w-full px-4">
            <h1 className="text-lg font-bold">Backup Logs</h1>
            <button
              className="text-xs px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
              onClick={() => setSortAsc((v) => !v)}
            >
              {sortAsc ? "↑ Date" : "↓ Date"}
            </button>
          </div>
          <div className="w-full overflow-y-auto scrollbar-hide flex md:flex-col gap-2 px-4 py-2 md:py-0">
            {sortedBackupList.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleBackupDetail(item.filename)}
                className={`w-full border border-gray-200 rounded-md transition-all duration-300 bg-white shadow-2xs px-4 py-2 flex flex-col gap-2 cursor-pointer ${
                  selectedFilename === item.filename
                    ? "scale-105 shadow-2xl"
                    : ""
                }`}
              >
                <h1 className="text-base font-bold">
                  {item.filename.slice(0, 15)}
                </h1>
                <p className="text-sm text-gray-500">Time: {item.time}</p>
              </div>
            ))}
          </div>
        </div>
        {backupData && (
          <div className="flex flex-col">
            <h1 className="text-lg font-bold mb-3 ml-4 md:ml-0">Logs Info</h1>
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="ml-4 md:ml-0 rounded-md border border-gray-300 border-t-0  w-[500px] lg:w-[800px] h-[45vh] md:h-[65vh] lg:h-[82vh] bg-white overflow-y-auto scrollbar-hide">
                {Object.entries(backupData).map(([groupKey, groupValue]) => (
                  <div key={groupKey}>
                    <div className="w-full flex items-center justify-between border border-gray-300 border-l-0 border-r-0 font-bold p-2 mb-2">
                      {groupKey}
                      {typeof groupValue != "object" ? (
                        <p>{String(groupValue)}</p>
                      ) : null}
                      <div className="w-[16px]" />
                    </div>
                    <BackupTable
                      data={groupValue}
                      parentKey={groupKey}
                      openKeys={openKeys}
                      setOpenKeys={setOpenKeys}
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  selectedFilename && handleRollback(selectedFilename)
                }
                disabled={!selectedFilename}
                className="h-fit w-fit inline-block px-6 py-3 ml-4 md:ml-0 mr-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-purple-700 to-pink-500 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Rollback
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
