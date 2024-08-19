import React, { useState } from "react";
import VentaForm from "./VentaForm";
import {
  InboxArrowDownIcon,
  ShoppingBagIcon,
  BookOpenIcon,
  BoltIcon,
  UserGroupIcon,
  ArrowUpOnSquareIcon,
  ArchiveBoxIcon

} from "@heroicons/react/24/outline";
import Options from "./UIX/Options";
import UsersForm from "./UsersForm";


import IngresarAlmacen from "./IngresarAlmacen";
import MostrarVentas from "./MostrarVentas";
import MostrarVentaVendedor from "./MostrarVentaVendedor"
import RepartirAlmacen from "./RepartirAlmacen";
import MegaBuscador from "./MegaBuscador";
import InventariosTienda from "./InventariosTienda";

const WindowsUIComponent = ({ vendedor }) => {
  const [activeTab, setActiveTab] = useState("Ventas");
  const [showSidebar, setShowSidebar] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowSidebar(false);
  };

  console.log(vendedor)

  const primaryColor = "bg-gradient-to-tl from-orange-500 to-rose-600";
  const secondaryColor =
    "bg-gradient-to-tl from-slate-50/40 via-slate-100/10 to-neutral-500/10";
  const tertiaryColor =
    "bg-gradient-to-r from-amber-50 via-pink-50 to-rose-400 shadow-2xl text-red-600";
  const cuaternaryColor =
    "hover:bg-gradient-to-r hover:from-amber-400 hover:to-pink-300/70";

  return (
    <div className="flex flex-col h-screen bg-gray-200 lg:flex-row">
      {/*Version para Moviles*/}
      <div className="lg:hidden flex justify-start shadow mb-0.5 p-2 rounded-b-md bg-gradient-to-tl from-orange-500 to-rose-600">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="mx-2 text-gray-500 hover:text-blue-700"
        >
          <svg
            className="w-8 h-8"
            color="white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="flex items-center ml-5">
          <img
            src={`https://ui-avatars.com/api/?name=${
              vendedor.nombres + " " + vendedor.apPaterno
            }&background=random`}
            alt={vendedor.nombres}
            className="w-10 h-10 rounded-full mr-4"
          />
          <div className="flex flex-col justify-between items-start mb-2">
            <div className="text-white font-semibold">{vendedor.nombres}</div>
            <div className="text-white">{vendedor.rol}</div>
          </div>
        </div>
      </div>

      <div
        className={`lg:block ${primaryColor} p-4 text-white lg:w-64  ${
          showSidebar
            ? "w-full translate-x-0"
            : "-translate-x-full lg:translate-x-0 lg:static fixed flex flex-wrap gap-0.5"
        }`}
      >
        {/*Version para Escritorio*/}
        <div className="hidden lg:flex justify-start mb-6 px-2 py-3 rounded-b-md bg-gradient-to-tl from-blue-500 to-green-600 -mx-4 -mt-4 shadow-lg shadow-black/30 ">
          <div className="flex items-center ml-5 ">
            <img
              src={`https://ui-avatars.com/api/?name=${
                vendedor.nombres + " " + vendedor.apPaterno
              }&background=random`}
              alt={vendedor.nombres}
              className="w-10 h-10 rounded-full mr-4 -ml-2"
            />
            <div className="flex flex-col justify-between items-start mb-2">
              <div className="text-white font-semibold">{vendedor.nombres}</div>
              <div className="text-white">{vendedor.rol}</div>
            </div>
          </div>
        </div>

        {vendedor.rol === "ADMINISTRATIVO" && <Options
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          tabName="Inventarios"
          Icon={InboxArrowDownIcon}
          tertiaryColor={tertiaryColor}
          secondaryColor={secondaryColor}
          cuaternaryColor={cuaternaryColor}
        />}
        {vendedor.rol === "ADMINISTRATIVO" && <Options
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          tabName="RepartirInventario"
          Icon={ArrowUpOnSquareIcon}
          tertiaryColor={tertiaryColor}
          secondaryColor={secondaryColor}
          cuaternaryColor={cuaternaryColor}
        />}
        {vendedor.rol === "ADMINISTRATIVO" && <Options
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          tabName="MegaBuscador"
          Icon={BoltIcon}
          tertiaryColor={tertiaryColor}
          secondaryColor={secondaryColor}
          cuaternaryColor={cuaternaryColor}
        />}
        <Options
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          tabName="InventarioTienda"
          Icon={ArchiveBoxIcon}
          tertiaryColor={tertiaryColor}
          secondaryColor={secondaryColor}
          cuaternaryColor={cuaternaryColor}
        />
        <Options
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          tabName="ListarVentas"
          Icon={BookOpenIcon}
          tertiaryColor={tertiaryColor}
          secondaryColor={secondaryColor}
          cuaternaryColor={cuaternaryColor}
        />
        <Options
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          tabName="RegistrarVentas"
          Icon={ShoppingBagIcon}
          tertiaryColor={tertiaryColor}
          secondaryColor={secondaryColor}
          cuaternaryColor={cuaternaryColor}
        />
        {vendedor.rol === "ADMINISTRATIVO" && <Options
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          tabName="Usuarios"
          Icon={UserGroupIcon}
          tertiaryColor={tertiaryColor}
          secondaryColor={secondaryColor}
          cuaternaryColor={cuaternaryColor}
        />}
      </div>

      {/* Contenido principal */}
      <div className="flex-1 sm:p-4 p-5 -ml-2.5 sm:ml-0 overflow-y-scroll ">
        {/* Barra de navegación */}
        {activeTab === "RepartirInventario" && <RepartirAlmacen />}          
        {activeTab === "MegaBuscador" && <MegaBuscador/>}
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
