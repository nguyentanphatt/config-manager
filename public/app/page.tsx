"use client";
import RenderObject from "@/components/RenderObject";
import Sidebar from "@/components/Sidebar";
import { faBars, faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState } from "react";
const data = {
  server: {
    maxWorkers: 10,
    port: 3333,
    secret: "JWT_SERVER_SECRET",
    public: "public",
  },
  auth: {
    token: "JWT_AUTH_TOKEN",
    allowedIps: "::1, 127.0.0.1",
    allowedOrigin: [
      "https://app.yourdomain.com",
      "http://localhost:6870",
      "http://localhost:7000",
    ],
  },
  minio: {
    masterServerEndPoint: "https://cdn.yourdomain.com",
    endPoints: [
      {
        endPoint: "MINIO_IP_OR_HOST",
        accessKey: "MINIO_ACCESS_KEY",
        secretKey: "MINIO_SECRET_KEY",
        port: 9001,
        useSSL: "true",
      },
    ],
  },
  websocket: {
    port: 3001,
    maxDevicesPerUser: 5,
    authTimeout: 5000,
    maxMessageSize: 2048,
    sessionTTL: 1800,
    idleTimeout: 120,
    messageTTL: 300,
    connectionWindowMs: 60000,
    maxConnections: 10,
  },
  email: {
    smtp: {
      host: "smtp.yourmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "no-reply@yourdomain.com",
        pass: "EMAIL_PASSWORD",
      },
    },
    from: "no-reply@yourdomain.com",
  },
  webpush: {
    contactEmail: "mailto:no-reply@yourdomain.com",
    vapidPublicKey: "PUBLIC_VAPID_KEY",
    vapidPrivateKey: "PRIVATE_VAPID_KEY",
  },
  rabbitmq: {
    url: "amqp://localhost",
    exchange: "task_exchange",
    dlx: "task_dlx",
    prefetch: 10,
    retryTtl: 60000,
    maxRetries: 3,
    retryDelay: 1000,
    queues: {
      email: "email_queue",
      webpush: "webpush_queue",
      notification: "notification_queue",
      retry: "retry_queue",
      cleaner: "cleaner_queue",
    },
  },
  cleaner_service: {
    schedule: "0 0 * * *",
    jobConfig: {
      target: "both",
      daysBefore: 30,
      batchSize: 1000,
    },
  },
  mongodb: {
    user: "",
    password: "",
    host: "localhost",
    port: "27016",
    dbname: "FileStore",
    secret: "JWT_MONGODB_SECRET",
  },
  redis: {
    url: "redis://localhost:6379",
  },
};

export default function Home() {
  const [openKeys, setOpenKeys] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const filteredData = Object.entries(data).filter(([groupKey, groupValue]) => {
    if (!search) return true;
    if (groupKey.toLowerCase().includes(search.toLowerCase())) return true;
    return Object.values(groupValue).some((v) =>
      String(v).toLowerCase().includes(search.toLowerCase())
    );
  });
  return (
    <div className="flex flex-col w-full">
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
      <div className="mx-5 lg:mx-0 lg:mr-10 border border-gray-300 border-t-0 overflow-x-auto max-h-[82vh] bg-white overflow-y-auto scrollbar-hide">
        <div className="min-w-[650px] overflow-x-auto">
          {filteredData.map(([groupKey, groupValue]) => (
            <div key={groupKey}>
              <h2 className="w-full border border-gray-300 border-l-0 border-r-0 font-bold p-2 my-2">
                {groupKey}
              </h2>
              <RenderObject
                data={groupValue}
                parentKey={groupKey}
                openKeys={openKeys}
                setOpenKeys={setOpenKeys}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
