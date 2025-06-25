"use client";
import Header from "@/components/Header";
import {
  faChevronDown,
  faChevronRight,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  const [openChildKeys, setOpenChildKeys] = useState<Record<string, boolean>>(
    {}
  );
  console.log(Object.entries(data));

  return (
    <div className="flex flex-col w-full">
      <Header />
      <div className="mr-10 border max-h-screen bg-white overflow-y-auto">
        {Object.entries(data).map(([groupKey, groupValue]) => (
          <div key={groupKey}>
            <h2 className="w-full border font-bold p-2">{groupKey}</h2>
            <div className="flex flex-col gap-1 p-2">
              {Object.entries(groupValue).map(([key, value]) => {
                const shouldHide =
                  value === null ||
                  value === undefined ||
                  value === "" ||
                  (Array.isArray(value) && value.length === 0);

                if (shouldHide) return null;

                return (
                  <div key={key}>
                    <div className="grid grid-cols-4 items-center">
                      {Array.isArray(value) ? (
                        <>
                          <div
                            className="col-span-2 flex items-center gap-2 h-[40px] cursor-pointer"
                            onClick={() =>
                              setOpenKeys((prev) => ({
                                ...prev,
                                [key]: !prev[key],
                              }))
                            }
                          >
                            <p className="pl-4">{key}</p>
                            <FontAwesomeIcon
                              icon={
                                openKeys[key] ? faChevronDown : faChevronRight
                              }
                              size="sm"
                            />
                          </div>
                          <div className="col-span-1" />
                          <div className="flex justify-end gap-1" />
                        </>
                      ) : (
                        <>
                          <p className="pl-4 col-span-2">{key}</p>
                          <p className="text-left">{String(value)}</p>
                          <div className="flex justify-end gap-1">
                            <div className="h-10 aspect-square flex items-center justify-center rounded bg-gradient-to-tl from-slate-800 to-gray-900 text-white cursor-pointer">
                              <FontAwesomeIcon icon={faPen} size="1x" />
                            </div>
                            <div className="h-10 aspect-square flex items-center justify-center rounded bg-gradient-to-tl from-red-600 to-rose-400 text-white cursor-pointer">
                              <FontAwesomeIcon icon={faTrash} size="1x" />
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Nếu là array và đang mở */}
                    {Array.isArray(value) && openKeys[key] && (
                      <div className="flex flex-col gap-1 mt-1">
                        {value.map((item, idx) => {
                          const isObject =
                            typeof item === "object" && item !== null;
                          const itemKey = `${key}-${idx}`; // ví dụ: endPoints-0

                          return (
                            <div key={itemKey}>
                              <div className="grid grid-cols-4 items-center">
                                <div
                                  className="pl-8 col-span-2 flex items-center gap-2 cursor-pointer h-[40px]"
                                  onClick={() =>
                                    setOpenChildKeys((prev) => ({
                                      ...prev,
                                      [itemKey]: !prev[itemKey],
                                    }))
                                  }
                                >
                                  <p>
                                    {isObject ? `${key} ${idx + 1}` : idx + 1}
                                  </p>
                                  {isObject && (
                                    <FontAwesomeIcon
                                      icon={
                                        openChildKeys[itemKey]
                                          ? faChevronDown
                                          : faChevronRight
                                      }
                                      size="sm"
                                    />
                                  )}
                                </div>

                                {isObject ? (
                                  <>
                                    <p className="text-left" />
                                    <div className="flex justify-end gap-1" />
                                  </>
                                ) : (
                                  <>
                                    <p className="text-left">{String(item)}</p>
                                    <div className="flex justify-end gap-1">
                                      <div className="h-10 aspect-square flex items-center justify-center rounded bg-gradient-to-tl from-slate-800 to-gray-900 text-white cursor-pointer">
                                        <FontAwesomeIcon
                                          icon={faPen}
                                          size="1x"
                                        />
                                      </div>
                                      <div className="h-10 aspect-square flex items-center justify-center rounded bg-gradient-to-tl from-red-600 to-rose-400 text-white cursor-pointer">
                                        <FontAwesomeIcon
                                          icon={faTrash}
                                          size="1x"
                                        />
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>

                              {/* Nếu là object và đang mở */}
                              {isObject && openChildKeys[itemKey] && (
                                <div className="flex flex-col gap-1 mt-1 ml-8">
                                  {Object.entries(item).map(
                                    ([subKey, subVal]) => (
                                      <div
                                        key={subKey}
                                        className="grid grid-cols-4 items-center"
                                      >
                                        <p className="pl-8 col-span-2">
                                          {subKey}
                                        </p>
                                        <p className="text-left">
                                          {String(subVal)}
                                        </p>
                                        <div className="flex justify-end gap-1">
                                          <div className="h-10 aspect-square flex items-center justify-center rounded bg-gradient-to-tl from-slate-800 to-gray-900 text-white cursor-pointer">
                                            <FontAwesomeIcon
                                              icon={faPen}
                                              size="1x"
                                            />
                                          </div>
                                          <div className="h-10 aspect-square flex items-center justify-center rounded bg-gradient-to-tl from-red-600 to-rose-400 text-white cursor-pointer">
                                            <FontAwesomeIcon
                                              icon={faTrash}
                                              size="1x"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
