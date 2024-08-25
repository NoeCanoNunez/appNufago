import React from 'react';

const Options = ({ activeTab, handleTabChange, tabName, Icon, isCollapsed, tertiaryColor, secondaryColor, cuaternaryColor }) => {
  return (
    <div
      className={`shadow-purple-900/40 shadow-md flex items-center mx-2 py-2 rounded-md cursor-pointer mb-2 transition-all duration-300 ${
        activeTab === tabName
          ? `${tertiaryColor}`
          : `${secondaryColor} text-white ${cuaternaryColor} hover:text-white`
      }`}
      onClick={() => handleTabChange(tabName)}
    >
      {/* Ícono de la opción */}
      <Icon className={`w-6 h-6 ${isCollapsed ? "mx-auto" : "mr-2 text-white"}`} />
      
      {/* Nombre de la opción (se muestra solo cuando la barra no está colapsada) */}
      {!isCollapsed && <span className="ml-2">{tabName}</span>}
    </div>
  );
};

export default Options;
