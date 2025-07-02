"use client";
import { setAuthToken } from "@/lib/setAuthToken";
import { login } from "@/module/userService";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<any>();
  const router = useRouter();
  const handleLogin = async () => {
    const res = await login(username, password);
    if (res && res.token) {
      setToken(res.token);
      await setAuthToken(res.token);
      toast.success("Login successful");
      console.log("token", token);
      router.push("/");
    } else {
      toast.error("Login failed");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col gap-5 bg-white min-w-xs md:min-w-md px-5 pt-5 pb-10 rounded-md">
        <h1 className="text-[40px] font-bold text-center">Login</h1>
        <div className="flex flex-col gap-3">
          <p>Username</p>
          <input
            type="text"
            placeholder="username"
            className="focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
          ></input>
        </div>
        <div className="flex flex-col gap-3">
          <p>Password</p>
          <input
            type="password"
            placeholder="*********"
            className="focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
          ></input>
        </div>
        <button
          type="button"
          onClick={handleLogin}
          className="inline-block px-6 py-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-slate-800 to-gray-900 leading-pro text-sm ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Page;
