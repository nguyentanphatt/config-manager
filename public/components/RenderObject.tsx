"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Dispatch, SetStateAction, useState } from "react";
import { deleteConfigKey } from "@/module/configService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface RenderObjectProps {
  data: any;
  parentKey: string;
  level?: number;
  openKeys: { [key: string]: boolean };
  setOpenKeys: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
  fetchData: () => Promise<void>;
}

const RenderObject = ({
  data,
  parentKey,
  level = 1,
  openKeys,
  setOpenKeys,
  fetchData,
}: RenderObjectProps) => {
  const [deleteKey, setDeleteKey] = useState<string | null>(null);
  const router = useRouter();
  const handleDelete = async () => {
    if (deleteKey) {
      try {
        await deleteConfigKey(deleteKey);
        await fetchData();
        setDeleteKey(null);
        toast.success("Key delete successful");
      } catch (error) {
        toast.error("Error when delete" + error);
        setDeleteKey(null);
      }
    }
  };
  return (
    <>
      {deleteKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Xác nhận xóa</h3>
            <p className="mb-6">
              Bạn có chắc chắn muốn xóa{" "}
              <span className="font-mono">{deleteKey}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={() => setDeleteKey(null)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={handleDelete}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1">
        {Object.entries(data).map(([key, value]) => {
          const currentKey = `${parentKey}.${key}`;
          const isArray = Array.isArray(value);
          const isObject =
            typeof value === "object" && value !== null && !isArray;

          return (
            <div key={currentKey}>
              <div className="grid grid-cols-4 items-center">
                <div
                  className="col-span-2 flex items-center gap-2 h-[40px] cursor-pointer"
                  onClick={() => {
                    if (isArray || isObject) {
                      setOpenKeys((prev) => ({
                        ...prev,
                        [currentKey]: !prev[currentKey],
                      }));
                    }
                  }}
                >
                  <p style={{ marginLeft: `${level * 15}px` }}>{key}</p>
                  {(isArray || isObject) && (
                    <div className="size-5 shrink-0">
                      <FontAwesomeIcon
                        icon={
                          openKeys[currentKey] ? faChevronDown : faChevronRight
                        }
                        className="w-full h-full"
                      />
                    </div>
                  )}
                </div>
                {isArray || isObject ? (
                  <>
                    <div />
                    <div className="flex justify-end gap-1" />
                  </>
                ) : (
                  <>
                    <p className="text-left">{String(value)}</p>
                    <div className="flex justify-end gap-1 pr-1">
                      <div
                        onClick={() => {
                          const firstKey = parentKey.split(".")[0];
                          const restKey = currentKey.slice(firstKey.length + 1);
                          router.push(`/keys/${firstKey}?id=${restKey}`);
                        }}
                        className="w-10 h-10 flex items-center justify-center rounded text-black cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
                      </div>
                      <div
                        onClick={() => setDeleteKey(parentKey + "." + key)}
                        className="w-10 h-10 flex items-center justify-center rounded text-black cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {isArray && openKeys[currentKey] && (
                <div className="flex flex-col gap-1 mt-1">
                  {value.map((item, idx) => {
                    const itemKey = `${currentKey}[${idx}]`;
                    const isItemObject =
                      typeof item === "object" && item !== null;

                    return (
                      <div key={itemKey}>
                        <div className="grid grid-cols-4 items-center">
                          <div
                            className="col-span-2 flex items-center gap-2 cursor-pointer h-[40px]"
                            style={{ marginLeft: `${(level + 1) * 10}px` }}
                            onClick={() =>
                              isItemObject &&
                              setOpenKeys((prev) => ({
                                ...prev,
                                [itemKey]: !prev[itemKey],
                              }))
                            }
                          >
                            <p>
                              {isItemObject ? `${key} ${idx + 1}` : idx + 1}
                            </p>
                            {isItemObject && (
                              <div className="size-5 shrink-0">
                                <FontAwesomeIcon
                                  icon={
                                    openKeys[itemKey]
                                      ? faChevronDown
                                      : faChevronRight
                                  }
                                  className="w-full h-full"
                                />
                              </div>
                            )}
                          </div>
                          {isItemObject ? (
                            <>
                              <p className="text-left" />
                              <div className="flex justify-end gap-1" />
                            </>
                          ) : (
                            <>
                              <p className="text-left">{String(item)}</p>
                              <div className="flex justify-end gap-1 pr-1">
                                <div
                                  onClick={() => {
                                    const firstKey = parentKey.split(".")[0];
                                    const restKey = currentKey.slice(
                                      firstKey.length + 1
                                    );
                                    router.push(
                                      `/keys/${firstKey}?id=${restKey}[${idx}]`
                                    );
                                  }}
                                  className="w-10 h-10 flex items-center justify-center rounded text-black cursor-pointer"
                                >
                                  <FontAwesomeIcon
                                    icon={faPen}
                                    className="w-4 h-4"
                                  />
                                </div>
                                <div
                                  onClick={() =>
                                    setDeleteKey(
                                      parentKey + "." + key + `[${idx}]`
                                    )
                                  }
                                  className="w-10 h-10 flex items-center justify-center rounded bg-gradient-to-tl text-black cursor-pointer"
                                >
                                  <FontAwesomeIcon
                                    icon={faTrash}
                                    className="w-4 h-4"
                                  />
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        {isItemObject && openKeys[itemKey] && (
                          <RenderObject
                            data={item}
                            parentKey={itemKey}
                            level={level + 2}
                            openKeys={openKeys}
                            setOpenKeys={setOpenKeys}
                            fetchData={fetchData}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {isObject && openKeys[currentKey] && (
                <RenderObject
                  data={value}
                  parentKey={currentKey}
                  level={level + 1}
                  openKeys={openKeys}
                  setOpenKeys={setOpenKeys}
                  fetchData={fetchData}
                />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default RenderObject;
