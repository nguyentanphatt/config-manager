"use client";
import { faBars, faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { useRouter } from "next/navigation";
import { SearchInputProps } from "@/contants/type";

const Header = ({ value, onChange }: SearchInputProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <div className="w-full flex items-center justify-between px-5 lg:px-0 lg:pr-10 py-5">
      <div
        className="lg:hidden p-3 cursor-pointer text-black z-50 relative"
        onClick={() => setOpen(true)}
      >
        <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-opacity-30 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-md transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>
      <div className="relative flex flex-wrap items-stretch w-[50%] md:w-[80%] transition-all rounded-lg ease-soft">
        <span className="text-sm ease-soft leading-5.6 absolute z-50 -ml-px flex h-full items-center whitespace-nowrap rounded-lg rounded-tr-none rounded-br-none border border-r-0 border-transparent bg-transparent py-2 px-2.5 text-center font-normal text-slate-500 transition-all">
          <FontAwesomeIcon icon={faSearch} size="1x" />
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="pl-9 text-sm focus:shadow-soft-primary-outline ease-soft w-1/100 leading-5.6 relative -ml-px block min-w-0 flex-auto rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
          placeholder="Type here..."
        />
      </div>
      <div
        className="flex gap-2 items-center cursor-pointer"
        onClick={() => router.push("/login")}
      >
        <FontAwesomeIcon icon={faUser} size="1x" />
        <p>Sign in</p>
      </div>
    </div>
  );
};

export default Header;
