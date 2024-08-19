import React from 'react';

const Options = ({ activeTab, handleTabChange, tabName, Icon, tertiaryColor, secondaryColor, cuaternaryColor }) => {
  return (
    <div
      className={` shadow-purple-900/40 shadow-md flex items-center px-4 py-2 rounded-md cursor-pointer mb-2 ${
        activeTab === tabName
          ? `${tertiaryColor}`
          : `${secondaryColor} text-white ${cuaternaryColor} hover:text-white`
      }`}
      onClick={() => handleTabChange(tabName)}
    >
      <Icon className="w-6 h-6 mr-2" />
      {tabName}
    </div>
  );
};

export default Options;