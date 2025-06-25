"use client";
import { LogoIcon } from "@/contants/image";
import Image from "next/image";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faListUl,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
const Sidebar = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-5 mt-5 ml-5 max-w-80">
      <div className="flex items-center gap-3">
        <Image src={LogoIcon} alt="logo" width={100} height={50} />
        <p className="text-base font-bold uppercase text-black">
          config manager
        </p>
      </div>
      <div className="w-full h-0.5 border bg-black" />
      <div className="flex flex-col gap-2">
        <div
          className="flex items-center justify-between p-2 bg-white rounded-md"
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className="flex items-center gap-2">
            <div className="inline-block p-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-purple-700 to-pink-500 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs">
              <FontAwesomeIcon
                icon={faListUl}
                className=" text-white"
                size="xl"
              />
            </div>
            <p className="text-base text-black font-bold">Variable List</p>
          </div>
          <FontAwesomeIcon
            icon={faChevronRight}
            className={`transform transition-transform duration-300 ${
              open ? "rotate-90" : "rotate-0"
            }`}
          />
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            open ? "max-h-60 opacity-100 mt-2" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="ml-6 flex flex-col gap-2 text-sm text-gray-600">
            {["Server", "Auth", "Minio", "Redis"].map((item, index) => (
              <li
                key={index}
                className="flex items-center gap-2 hover:text-black cursor-pointer"
              >
                <span className="w-2 h-2 bg-gray-400 rounded-full inline-block" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-2 p-2 bg-white rounded-md">
          <div className="inline-block p-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-purple-700 to-pink-500 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs">
            <FontAwesomeIcon icon={faPlus} className=" text-white" size="xl" />
          </div>
          <p className="text-base text-black font-bold">Add Variable</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
