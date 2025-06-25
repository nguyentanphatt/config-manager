import { faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Header = () => {
  return (
    <div className="w-full flex items-center justify-between pr-10 py-5">
      <div className="relative flex flex-wrap items-stretch w-[90%] transition-all rounded-lg ease-soft">
        <span className="text-sm ease-soft leading-5.6 absolute z-50 -ml-px flex h-full items-center whitespace-nowrap rounded-lg rounded-tr-none rounded-br-none border border-r-0 border-transparent bg-transparent py-2 px-2.5 text-center font-normal text-slate-500 transition-all">
          <FontAwesomeIcon icon={faSearch} size="1x" />
        </span>
        <input
          type="text"
          className="pl-9 text-sm focus:shadow-soft-primary-outline ease-soft w-1/100 leading-5.6 relative -ml-px block min-w-0 flex-auto rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
          placeholder="Type here..."
        />
      </div>
      <div className="flex gap-2 items-center">
        <FontAwesomeIcon icon={faUser} size="1x" />
        <p>Sign in</p>
      </div>
    </div>
  );
};

export default Header;
