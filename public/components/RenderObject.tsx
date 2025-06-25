import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

interface RenderObjectProps {
  data: any;
  parentKey: string;
  level?: number;
  openKeys: { [key: string]: boolean };
  setOpenKeys: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}

const RenderObject = ({
  data,
  parentKey,
  level = 1,
  openKeys,
  setOpenKeys,
}: RenderObjectProps) => {
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
                <>
                  <div />
                  <div className="flex justify-end gap-1" />
                </>
              ) : (
                <>
                  <p className="text-left">{String(value)}</p>
                  <div className="flex justify-end gap-1 pr-1">
                    <div
                      onClick={() => console.log(parentKey + "." + key)}
                      className="w-10 h-10 flex items-center justify-center rounded bg-gradient-to-tl from-slate-800 to-gray-900 text-white cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center rounded bg-gradient-to-tl from-red-600 to-rose-400 text-white cursor-pointer">
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
                          <>
                            <p className="text-left" />
                            <div className="flex justify-end gap-1" />
                          </>
                        ) : (
                          <>
                            <p className="text-left">{String(item)}</p>
                            <div className="flex justify-end gap-1 pr-1">
                              <div
                                onClick={() =>
                                  console.log(
                                    parentKey + "." + key + `[${idx}]`
                                  )
                                }
                                className="w-10 h-10 flex items-center justify-center rounded bg-gradient-to-tl from-slate-800 to-gray-900 text-white cursor-pointer"
                              >
                                <FontAwesomeIcon
                                  icon={faPen}
                                  className="w-4 h-4"
                                />
                              </div>
                              <div className="w-10 h-10 flex items-center justify-center rounded bg-gradient-to-tl from-red-600 to-rose-400 text-white cursor-pointer">
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
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RenderObject;
