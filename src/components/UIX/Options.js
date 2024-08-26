import React, { useState, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const Options = ({
  activeTab,
  handleTabChange,
  tabName,
  Icon,
  isCollapsed,
  options,
  handleOptionChange,
  activeOption,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (options.some((option) => option.name === activeOption?.name)) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [activeOption, options]);

  const toggleOpen = () => {
    if (!isCollapsed) {
      setIsOpen(!isOpen);
    }
    handleTabChange(tabName);
  };

  const isActive = activeTab === tabName || options.some((option) => option === activeOption);

  return (
    <div className="mb-2">
      <div
        className={`text-xs md:text-sm flex items-center justify-between mx-3 px-1 py-1
           rounded-md cursor-pointer transition-all duration-1000 ${
             isActive ? `bg-white/70 rounded-[500px]` : `text-white/80`
           }
        }`}
        onClick={toggleOpen}
      >
        <div className="flex items-center">
          <Icon className={`w-5 h-5 ${isCollapsed ? "mx-0.5" : "mr-2"}`} />
          {!isCollapsed && <span className="ml-2">{tabName}</span>}
        </div>
        {!isCollapsed && (
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform duration-1000 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        )}
      </div>
      <div className="className"></div>
      {isOpen && !isCollapsed && (
        <>
          <AnimatePresence>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mt-1 ml-6 text-xs md:text-sm/2">
                {options.map((option) => (
                  <div key={option.name}>
                    <button
                      onClick={() => handleOptionChange(option)}
                      className={`
                      w-[220px] p-1 flex items-center rounded-md transition-all duration-300
                      ${
                        activeOption?.name === option.name
                          ? `bg-white/60`
                          : `text-white/80`
                      }
                      hover:bg-white/20
                    `}
                    >
                      <option.Icon className="w-4 h-4 mr-2" />
                      <span>{option.name}</span>
                    </button>
                    {/* Verifica si la opción tiene subopciones */}
                    {option.subOptions && option.subOptions.length > 0 && (
                      <div className="ml-4 mt-1">
                        {option.subOptions.map((subOption) => (
                          <button
                            key={subOption.name}
                            onClick={() => handleOptionChange(subOption)}
                            className={`
                              w-[180px] p-1 flex items-center rounded-md transition-all duration-300
                              ${
                                activeOption?.name === subOption.name
                                  ? `bg-white/40`
                                  : `text-white/70`
                              }
                              hover:bg-white/20
                            `}
                          >
                            <subOption.Icon className="w-4 h-4 mr-2" />
                            <span>{subOption.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  );
};


export default Options;
