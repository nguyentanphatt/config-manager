"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Dispatch, SetStateAction } from "react";

interface BackupTableProps {
  data: any;
  parentKey: string;
  level?: number;
  openKeys: { [key: string]: boolean };
  setOpenKeys: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
}

const BackupTable = ({
  data,
  parentKey,
  level = 1,
  openKeys,
  setOpenKeys,
}: BackupTableProps) => {
  return (
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
                <div className="col-span-2" />
              ) : (
                <p className="col-span-2 text-left">{String(value)}</p>
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
                          <p>{isItemObject ? `${key} ${idx + 1}` : idx + 1}</p>
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
                          <div className="col-span-2" />
                        ) : (
                          <p className="col-span-2 text-left">{String(item)}</p>
                        )}
                      </div>

                      {isItemObject && openKeys[itemKey] && (
                        <BackupTable
                          data={item}
                          parentKey={itemKey}
                          level={level + 2}
                          openKeys={openKeys}
                          setOpenKeys={setOpenKeys}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {isObject && openKeys[currentKey] && (
              <BackupTable
                data={value}
                parentKey={currentKey}
                level={level + 1}
                openKeys={openKeys}
                setOpenKeys={setOpenKeys}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BackupTable;
