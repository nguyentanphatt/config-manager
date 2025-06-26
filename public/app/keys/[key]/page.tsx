"use client";
import Header from "@/components/Header";
import React, { useState } from "react";
const data = {
  server: {
    maxWorkers: 10,
    port: 3333,
    secret: "JWT_SERVER_SECRET",
  },
};

type Props = {
  data: Record<string, any>; // Ví dụ: server object
  onChange?: (key: string, value: string) => void;
};

const ConfigForm = ({ data, onChange }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex items-center gap-4">
          <label className="w-32 font-medium">{key}:</label>
          <input
            type="text"
            defaultValue={value}
            className="border px-3 py-1 rounded w-full"
            onChange={(e) => onChange?.(key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

const Page = () => {
  const [search, setSearch] = useState("");
  const handleChange = (k: string, val: string) => {
    console.log(k + " " + val);
  };
  return (
    <div className="flex flex-col w-full">
      <Header value={search} onChange={setSearch} />
      <div className="mx-5 lg:mx-0 lg:mr-10 border border-gray-300 border-t-0 overflow-x-auto max-h-[82vh] bg-white overflow-y-auto scrollbar-hide">
        <ConfigForm data={data.server} onChange={handleChange} />
      </div>
    </div>
  );
};

export default Page;
