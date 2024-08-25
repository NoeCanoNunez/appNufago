import React, { useState } from "react";
import { InboxArrowDownIcon, ShoppingBagIcon, BookOpenIcon, BoltIcon, UserGroupIcon, ArrowUpOnSquareIcon, ArchiveBoxIcon } from "@heroicons/react/24/outline";
import Options from "./UIX/Options";
import VentaForm from "./VentaForm";
import UsersForm from "./UsersForm";
import IngresarAlmacen from "./IngresarAlmacen";
import MostrarVentas from "./MostrarVentas";
import MostrarVentaVendedor from "./MostrarVentaVendedor";
import RepartirAlmacen from "./RepartirAlmacen";
import MegaBuscador from "./MegaBuscador";
import InventariosTienda from "./InventariosTienda";

const WindowsUIComponent = ({ vendedor }) => {
  const [activeTab, setActiveTab] = useState("Ventas");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const primaryColor = "bg-gradient-to-tl from-orange-500 to-rose-600";
  const secondaryColor =
    "bg-gradient-to-tl from-slate-50/40 via-slate-100/10 to-neutral-500/10";
  const tertiaryColor =
    "bg-gradient-to-r from-amber-50 via-pink-50 to-rose-400 shadow-2xl text-red-600";
  const cuaternaryColor =
    "hover:bg-gradient-to-r hover:from-amber-400 hover:to-pink-300/70";

  return (
    <div className="flex h-screen bg-gray-200">
      {/* Sidebar */}
      <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'w-14' : 'w-64'} ${primaryColor} shadow-lg`}>
        {/* Logo y botón de colapso */}
        <div className="flex items-center justify-between p-4">
          <button onClick={toggleSidebar} className="focus:outline-none">
            <svg className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCollapsed ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Opciones de la barra de herramientas */}
        <div className="space-y-2">
          <Options
            activeTab={activeTab}
            handleTabChange={handleTabChange}
            tabName="Inventarioas"
            Icon={InboxArrowDownIcon}
            isCollapsed={isCollapsed}
            tertiaryColor={tertiaryColor}
          secondaryColor={secondaryColor}
          cuaternaryColor={cuaternaryColor}
          />
          <Options
            activeTab={activeTab}
            handleTabChange={handleTabChange}
            tabName="RepartirInventario"
            Icon={ArrowUpOnSquareIcon}
            isCollapsed={isCollapsed}
            tertiaryColor={tertiaryColor}
          secondaryColor={secondaryColor}
          cuaternaryColor={cuaternaryColor}
          />
          <Options
            activeTab={activeTab}
            handleTabChange={handleTabChange}
            tabName="MegaBuscador"
            Icon={BoltIcon}
            isCollapsed={isCollapsed}
            tertiaryColor={tertiaryColor}
          secondaryColor={secondaryColor}
          cuaternaryColor={cuaternaryColor}
          />
          <Options
            activeTab={activeTab}
            handleTabChange={handleTabChange}
            tabName="InventarioTienda"
            Icon={ArchiveBoxIcon}
            isCollapsed={isCollapsed}
            tertiaryColor={tertiaryColor}
          secondaryColor={secondaryColor}
          cuaternaryColor={cuaternaryColor}
          />
          <Options
            activeTab={activeTab}
            handleTabChange={handleTabChange}
            tabName="ListarVentas"
            Icon={BookOpenIcon}
            isCollapsed={isCollapsed}
            tertiaryColor={tertiaryColor}
          secondaryColor={secondaryColor}
          cuaternaryColor={cuaternaryColor}
          />
          {vendedor.rol === "ADMINISTRATIVO" && (
            <Options
              activeTab={activeTab}
              handleTabChange={handleTabChange}
              tabName="Usuarios"
              Icon={UserGroupIcon}
              isCollapsed={isCollapsed}
              tertiaryColor={tertiaryColor}
          secondaryColor={secondaryColor}
          cuaternaryColor={cuaternaryColor}
            />
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === "RepartirInventario" && <RepartirAlmacen />}
        {activeTab === "MegaBuscador" && <MegaBuscador />}
        {activeTab === "Inventarios" && <IngresarAlmacen />}
        {activeTab === "InventarioTienda" && <InventariosTienda />}
        {activeTab === "RegistrarVentas" && <VentaForm vendedor={vendedor} />}
        {activeTab === "Usuarios" && <UsersForm />}
        {activeTab === "ListarVentas" && (vendedor.rol === "ADMINISTRATIVO" ? <MostrarVentas /> : <MostrarVentaVendedor vendedor={vendedor} />)}
      </div>
    </div>
  );
};

export default WindowsUIComponent;
