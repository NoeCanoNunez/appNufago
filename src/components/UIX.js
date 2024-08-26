import React, { useState, useEffect } from "react";
import { InboxArrowDownIcon, ShoppingBagIcon, BookOpenIcon, BoltIcon, UserGroupIcon, ArrowUpOnSquareIcon, ArchiveBoxIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
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
  const [activeTab, setActiveTab] = useState(null);
  const [activeOption, setActiveOption] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTabChange = (tab) => {
    if (!isMobile && isCollapsed) {
      setIsCollapsed(false);
    };
  };

  const handleOptionChange = (option) => {
    setActiveOption(option);
    setActiveTab(tabsConfig.find(tab => tab.options.includes(option)).name);
    if (isMobile) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const primaryColor = "bg-gradient-to-tl from-green-400/10 via-blue-500/10 to-indigo-600/10";
  const secondaryColor = "bg-gradient-to-tr from-white/60 via-blue-200/40 to-white/20 text-white hover:text-white";
  const tertiaryColor = "bg-gradient-to-r from-cyan-300 via-teal-400 to-blue-500 shadow-lg text-white";
  const cuaternaryColor = "hover:bg-gradient-to-r hover:from-cyan-400/70 hover:to-blue-300/80 shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300";


  const tabsConfig = [
    {
      name: "Home",
      Icon: HomeIcon, // Cambia al icono que prefieras
      options: [
        { name: "Ir a Home", Icon: HomeIcon, component: null },
        {
          name: "Mi Cuenta",
          Icon: UserIcon,
          subOptions: [
            { name: "Detalle de mis Pagos", Icon: MoneyIcon, component: <DetallePagos /> },
            { name: "Pagar mi cuenta", Icon: CreditCardIcon, component: <PagarCuenta /> }
          ]
        },
        { name: "Aprobaciones", Icon: CheckCircleIcon, component: <Aprobaciones /> },
        { name: "Cambio Clave", Icon: KeyIcon, component: <CambioClave /> }
      ]
    },
    {
      name: "Soporte",
      Icon: SupportIcon,
      options: [
        { name: "Ver todos los soportes", Icon: ListBulletIcon, component: <VerSoportes /> },
        { name: "Elevar a Sop. Supervisor Auranet", Icon: ArrowUpIcon, component: <ElevarSoporte /> }
      ]
    },
    {
      name: "Administración",
      Icon: CogIcon,
      options: [
        { name: "Empresa", Icon: BuildingIcon, component: null },
        {
          name: "Opciones",
          Icon: MenuIcon,
          subOptions: [
            { name: "General", Icon: ClipboardIcon, component: <General /> },
            { name: "Recursos", Icon: UsersIcon, component: <Recursos /> },
            { name: "Partidas", Icon: ArchiveBoxIcon, component: <Partidas /> },
            { name: "Contabilidad", Icon: CurrencyDollarIcon, component: <Contabilidad /> },
            { name: "Compras", Icon: ShoppingBagIcon, component: <Compras /> },
            { name: "Costos", Icon: CalculatorIcon, component: <Costos /> },
            { name: "Impresiones", Icon: PrinterIcon, component: <Impresiones /> },
            { name: "Valores Predef", Icon: DocumentIcon, component: <ValoresPredef /> },
            { name: "Fac. Electrónica", Icon: DocumentTextIcon, component: <FacElectronica /> },
            { name: "Venta Inmobiliaria", Icon: HomeIcon, component: <VentaInmobiliaria /> },
            { name: "Cobranza Clientes", Icon: CashIcon, component: <CobranzaClientes /> },
            { name: "CC Integrales", Icon: BanknotesIcon, component: <CCIntegrales /> },
            { name: "Opciones Ventas", Icon: TagIcon, component: <OpcionesVentas /> },
            { name: "Opciones Ventas 2", Icon: TagIcon, component: <OpcionesVentas2 /> }
          ]
        },
        {
          name: "Usuarios",
          Icon: UserGroupIcon,
          subOptions: [
            { name: "Aprobadores Convenios de Compra", Icon: DocumentCheckIcon, component: <AprobadoresConvenios /> },
            { name: "Aprobadores", Icon: DocumentCheckIcon, component: <Aprobadores /> },
            { name: "Docum. Tribu. Contabilidad", Icon: DocumentIcon, component: <DocumTribu /> },
            { name: "Decimales", Icon: NumberIcon, component: <Decimales /> },
            { name: "Auditoría", Icon: ShieldCheckIcon, component: <Auditoria /> }
          ]
        }
      ]
    },
    {
      name: "Tablas",
      Icon: TableIcon,
      options: [
        { name: "Tablas Ventas Web", Icon: GlobeIcon, component: <TablasVentasWeb /> },
        {
          name: "Tablas Personas",
          Icon: UserGroupIcon,
          subOptions: [
            { name: "Tipo de Sucursales", Icon: BuildingIcon, component: <TipoSucursales /> },
            { name: "Autorizaciones de Bloqueo", Icon: LockClosedIcon, component: <AutorizacionesBloqueo /> }
          ]
        },
        { name: "Tablas Recursos", Icon: UserGroupIcon, component: <TablasRecursos /> },
        { name: "Tablas Partidas", Icon: ClipboardIcon, component: <TablasPartidas /> },
        { name: "Tablas Otros", Icon: FolderIcon, component: <TablasOtros /> },
        { name: "Tablas Contabilidad", Icon: CurrencyDollarIcon, component: <TablasContabilidad /> },
        { name: "Tablas Utilidades", Icon: CogIcon, component: <TablasUtilidades /> },
        { name: "Planillas", Icon: DocumentTextIcon, component: <Planillas /> }
      ]
    },
    {
      name: "Presupuesto",
      Icon: CurrencyDollarIcon,
      options: [
        { name: "Presupuesto", Icon: ClipboardIcon, component: <Presupuesto /> },
        { name: "Partidas", Icon: ArchiveBoxIcon, component: <Partidas /> },
        {
          name: "Inicio de Partida",
          Icon: PlayIcon,
          subOptions: [
            { name: "Inicio Partida", Icon: PlayIcon, component: <InicioPartida /> },
            { name: "Editar Inicio Partida", Icon: PencilIcon, component: <EditarInicioPartida /> }
          ]
        },
        { name: "Informes", Icon: DocumentReportIcon, component: <Informes /> }
      ]
    },
    {
      name: "Compras",
      Icon: ShoppingBagIcon,
      options: [
        { name: "Solicitud de Recursos", Icon: ClipboardIcon, component: <SolicitudRecursos /> },
        { name: "Solicitud de Cotización", Icon: DocumentTextIcon, component: <SolicitudCotizacion /> },
        { name: "Orden de Compra", Icon: ShoppingCartIcon, component: <OrdenCompra /> },
        { name: "Convenio de Compra", Icon: DocumentDuplicateIcon, component: <ConvenioCompra /> },
        { name: "Pto. Pedido-Ordenado-Recibido", Icon: ArchiveBoxIcon, component: <PtoPedido /> },
        {
          name: "Gestión de Compras",
          Icon: CogIcon,
          subOptions: [
            { name: "Informes", Icon: DocumentReportIcon, component: <InformesCompras /> },
            { name: "Informes por pantalla", Icon: DesktopComputerIcon, component: <InformesPantalla /> }
          ]
        },
        {
          name: "Utilidades",
          Icon: WrenchIcon,
          subOptions: [
            { name: "Orden de Compra Rendición", Icon: DocumentCheckIcon, component: <OrdenCompraRendicion /> },
            { name: "Ordenes de compra empresa", Icon: ShoppingBagIcon, component: <OrdenesCompraEmpresa /> }
          ]
        }
      ]
    }
  ];
  
  

  return (
    <div className="flex h-screen bg-gray-200/5">
      {/* Sidebar */}
      <div 
        className={`
          transition-all duration-300 ease-in-out 
          ${isMobile ? (isCollapsed ? 'w-0 overflow-hidden' : 'w-64 bg-slate-800/95') : (isCollapsed ? 'w-14' : 'w-64')}
          ${primaryColor} shadow-lg fixed h-full z-50
        `}
      >
        {/* Logo y botón de colapso para PC */}
        <div className="flex items-center justify-between p-4">
          <button onClick={toggleSidebar} className="focus:outline-none">
            <svg className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={!isCollapsed ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        <div>
          {tabsConfig.map((tab, i) => (
            <Options
              key={tab.name}
              activeTab={activeTab}
              handleTabChange={handleTabChange}
              tabName={tab.name}
              Icon={tab.Icon}
              isCollapsed={isCollapsed}
              tertiaryColor={tertiaryColor}
              secondaryColor={secondaryColor}
              cuaternaryColor={cuaternaryColor}
              options={tab.options}
              handleOptionChange={handleOptionChange}
              activeOption={activeOption}
            />
          ))}
        </div>
      </div>
      
      {/* Botón de menú para móviles */}
      {isMobile && isCollapsed && (
        <button 
          onClick={toggleSidebar} 
          className={`bg-slate-900/90 fixed top-2 left-2 z-50 p-2 rounded-full ${primaryColor}`}
        >
          <svg className="w-6 h-6 text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Contenido principal */}
      <div className={`flex-1 p-4 overflow-y-auto ${isMobile ? 'ml-0' : (isCollapsed ? 'ml-14' : 'ml-64')}`}>
        {activeOption && activeOption.component}
      </div>
    </div>
  );
};

export default WindowsUIComponent;