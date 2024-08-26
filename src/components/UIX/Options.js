import React, { useState, useEffect } from 'react';
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const Options = ({
  activeTab,
  handleTabChange,
  tabName,
  Icon,
  isCollapsed,
  options,
  handleOptionChange,
  activeOption
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Abrir el menú si alguna de sus opciones está activa
    if (options.some(option => option.name === activeOption?.name)) {
      setIsOpen(true);
    } else {
      setIsOpen(false)
    }
  }, [activeOption, options]);

  const toggleOpen = () => {
    if (!isCollapsed) {
      setIsOpen(!isOpen);
    }
    handleTabChange(tabName);
  };

  const isActive = activeTab === tabName || options.some(option => option === activeOption);

  return (
    <div className="mb-2">
      <div
        className={`text-xs md:text-sm flex items-center justify-between mx-2 px-2 rounded-md cursor-pointer transition-all duration-1000 ${
          isActive
          ? `bg-white/50 rounded-[50px]`
          : `text-white/80`}
        }`}
        onClick={toggleOpen}
      >
        <div className="flex items-center">
          <Icon className={`w-5 h-5 ${isCollapsed ? "mx-0.5" : "mr-2"}`} />
          {!isCollapsed && <span className="ml-2">{tabName}</span>}
        </div>
        {!isCollapsed && (
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform duration-1000 ${isOpen ? 'transform rotate-180' : ''}`}
          />
        )}
      </div>
      {isOpen && !isCollapsed && (
        <div className="mt-1 ml-6 text-xs md:text-sm/2">
          {options.map((option) => (
            <button
            key={option.name}
            onClick={() => handleOptionChange(option)}
            className={`
              w-[220px] p-1 flex items-center rounded-md transition-all duration-300
              ${activeOption?.name === option.name
                ? `bg-white/50`
                : `text-white/80`}
              hover:bg-white/20
            `}
          >
            <option.Icon className="w-4 h-4 mr-2" />
            <span>{option.name}</span>
          </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Options;