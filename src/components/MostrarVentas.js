import React, { useState, useEffect } from "react";
import axios from "axios";
import { API, API5 } from "../Accesos";
import Loader from "./support/Loader";
import { ordenarPor } from "../Helper";
import MostrarVentaForm from "./MostrarVenta/MostrarVentaForm";

import BotonXlsx from "./MostrarVenta/BotonXlsx"

const MostrarVentas = () => {
  const [mostrarLoader, setMostrarLoader] = useState(false);
  const [ventas, setVentas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(getFechaAyer());
  const [fechaFinal, setFechaFinal] = useState(getFechaAyer());

  const [selectedVenta, setSelectedVenta] = useState(null);
  const [showVentaForm, setShowVentaForm] = useState(false);

  const [almacenes, setAlmacenes] = useState([]);
  const [viewLoader, setViewLoader] = useState(true);

  const [selectedAlmacen, setSelectedAlmacen] = useState("");
  const [ventasFiltradas, setVentasFiltradas] = useState([]);

  const [totales, setTotales] = useState([]);

  const ventasPorAlmacen = ventasFiltradas.reduce((acc, venta) => {
    const almacen = venta.almacenName;
    const rentaAdelantada = parseFloat(venta.montoRentaAdelantada);
    const pagoInicial = parseFloat(venta.montoPagoInicial);
    const importeCancelado = parseFloat(venta.importeCancelado);
  
    if (!acc[almacen]) {
      acc[almacen] = {
        ventas: 1,
        rentasAdelantadas: rentaAdelantada,
        pagosIniciales: pagoInicial,
        pagosTotales: importeCancelado,
      };
    } else {
      acc[almacen].ventas += 1;
      acc[almacen].rentasAdelantadas += rentaAdelantada;
      acc[almacen].pagosIniciales += pagoInicial;
      acc[almacen].pagosTotales += importeCancelado;
    }
  
    return acc;
  }, {});

  useEffect(() => {
    axios
      .get(API)
      .then((response) => setAlmacenes(response.data.filter(objeto => !objeto.idAlmacen)))
      .catch((error) => console.log(error))
      .finally(() => setViewLoader(false));
  }, []);

  useEffect(() => {
    console.log(ventasFiltradas)
  }, [ventasFiltradas])
  

  useEffect(() => {
    if (selectedAlmacen === "") {
      setVentasFiltradas(ventas);
    } else {
      setVentasFiltradas(ventas.filter(venta => Number(venta.idAlmacen) === Number(selectedAlmacen)));
    }
  }, [selectedAlmacen]);

  useEffect(() => {
    setTotales(Object.entries(ventasPorAlmacen));
  }, [ventas])
  

  const handleAlmacenChange = (e) => {
    setSelectedAlmacen(e.target.value);
  };


  function getFechaAyer() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, "0");
    const day = String(yesterday.getDate()).padStart(2, "0");
    
    return `${year}-${month}-${day}`;
  }

  const fetchData = async () => {
    setMostrarLoader(true);
    try {
      const response = await axios.get(
        `${API5}?fechaInicio=${fechaInicio}&fechaFinal=${fechaFinal}`
      );
      setVentas(ordenarPor(response.data,['fechaVenta','idUsuario'],['ASCENDENTE','DESCENDENTE']));
      setVentasFiltradas(ordenarPor(response.data,['fechaVenta','idUsuario'],['ASCENDENTE','DESCENDENTE']));
      setMostrarLoader(false);
      setTotales(Object.entries(ventasPorAlmacen));
    } catch (error) {
      alert(error);
      setMostrarLoader(false);
    }
  };

  const handleFechaInicioChange = (e) => {
    setFechaInicio(e.target.value);
  };

  const handleFechaFinalChange = (e) => {
    setFechaFinal(e.target.value);
  };

  const handleBuscarClick = () => {
    fetchData();
  };

  return (
    <div className="text-xs bg-white/70 p-4 rounded-xl mx-auto max-w-full shadow-2xl shadow-black/70">
      <div className="text-xs bg-purple-600 p-2 sm:p-4 rounded-t-lg mx-auto max-w-full">
        <h2 className="text-lg font-medium text-white"> Buscador de Venta</h2>
      </div>
      <div className="text-xs flex flex-wrap my-4 gap-1 justify-center">
        <input
          type="date"
          className="text-xs border sm:text-base border-gray-300 rounded-l px-4 py-2 focus:outline-none"
          value={fechaInicio}
          onChange={handleFechaInicioChange}
        />
        <input
          type="date"
          className="text-xs border sm:text-base border-gray-300 rounded-r px-4 py-2 focus:outline-none"
          value={fechaFinal}
          onChange={handleFechaFinalChange}
        />
        <button
          className="text-sm bg-blue-500 sm:text-base hover:bg-blue-600 text-white font-bold py-2 px-4 ml-2 rounded"
          onClick={handleBuscarClick}
        >
          Buscar
        </button>
        <button
          className="text-sm bg-green-500 sm:text-base hover:bg-green-600 text-white font-bold py-2 px-4 ml-2 rounded"
          onClick={() => setShowVentaForm(true)}
          disabled={!selectedVenta}
        >
          Mostrar
        </button>
        { !viewLoader && <select
          className="text-xs border sm:text-base border-gray-300 rounded px-4 py-2 focus:outline-none"
          value={selectedAlmacen}
          onChange={handleAlmacenChange}
        >
          <option value="">Todos</option>
          {almacenes.map((almacen) => (
            <option key={almacen.id} value={almacen.id}>
              {almacen.almacen}
            </option>
          ))}
        </select> }
        <BotonXlsx csvData={ventasFiltradas} fileName="Ventas"/>
      </div>
      {mostrarLoader ? (
        <Loader />
      ) : (
        <div className="text-xs overflow-auto max-w-full max-h-[50vh] pb-4">
          <table className="text-xs bg-white table-auto w-auto max-w-full max-h-full overflow-scroll">
            <thead>
            <tr className="text-xs sticky top-0 bg-white sm:text-base">
                <th className="text-xs py-2 px-4 border-b">LUGAR</th>
                <th className="text-xs py-2 px-4 border-b">FECHA</th>
                <th className="text-xs py-2 px-4 border-b">TD</th>
                <th className="text-xs py-2 px-4 border-b">#DOC</th>
                <th className="text-xs py-2 px-4 border-b">SEC</th>
                <th className="text-xs py-2 px-4 border-b">CLIENTE/RAZON SOCIAL</th>
                <th className="text-xs py-2 px-4 border-b">TIPO OPERACION</th>
                <th className="text-xs py-2 px-4 border-b">CAMPAÑA TIPOOPERACION</th>
                <th className="text-xs py-2 px-4 border-b">NÚMERO</th>
                <th className="text-xs py-2 px-4 border-b">NÚMERO REFERENCIA</th>
                <th className="text-xs py-2 px-4 border-b">CHIP/EQUIPO</th>
                <th className="text-xs py-2 px-4 border-b">DESCRIPCIÓN DE SERIE</th>
                <th className="text-xs py-2 px-4 border-b">IMEI</th>
                <th className="text-xs py-2 px-4 border-b">ICCID</th>
                <th className="text-xs py-2 px-4 border-b">PLAN</th>                
                <th className="text-xs py-2 px-4 border-b">ASESOR</th>                
                <th className="text-xs py-2 px-4 border-b">OPERADOR</th>
                <th className="text-xs py-2 px-4 border-b">MODALIDAD</th>
                <th className="text-xs py-2 px-4 border-b">RENTA ADELANTADA</th>
                <th className="text-xs py-2 px-4 border-b">INICIAL</th>
                <th className="text-xs py-2 px-4 border-b">IMPORTE CANCELADO</th>
                <th className="text-xs py-2 px-4 border-b">BOLETA/FACTURA</th>
                <th className="text-xs py-2 px-4 border-b">DEPARTAMENTO</th>                
                <th className="text-xs py-2 px-4 border-b">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {ventasFiltradas.map((venta, index) => (
                <tr
                key={venta.id}
                className={`bg-${index % 2 === 0 ? 'gray-100' : 'white'} sm:text-base text-xs ${
                  selectedVenta?.id === venta.id ? 'bg-yellow-200' : ''
                }`}
                onClick={() => setSelectedVenta(venta)}
              >
                  <td className="text-xs py-2 px-4 border-b">{venta.almacenName}</td>
                  <td className="text-xs py-2 px-4 border-b">{venta.fechaVenta.split("-").reverse().join("/")}</td>
                  <td className="text-xs py-2 px-4 border-b">{venta.ClienteTipoDoc}</td>
                  <td className="text-xs py-2 px-4 border-b">{venta.ClienteNumDoc}</td>
                  <td className="text-xs py-2 px-4 border-b">{venta.numeroSec}</td>
                  <td className="text-xs py-2 px-4 border-b">{venta.ClienteNameOrRS} {venta.clienteApPaterno} {venta.clienteApMaterno}</td>
                  <td className="text-xs py-2 px-4 border-b">{venta.tipoOperacion}</td>
                  <td className="text-xs py-2 px-4 border-b">{venta.plazo}</td>
                  <td className="text-xs py-2 px-4 border-b">{venta.numeroCelular}</td>
                  <td className="text-xs py-2 px-4 border-b">{venta.numeroReferencia}</td>
                  <td className="text-xs py-2 px-4 border-b">{venta.chipPack}</td>                  
                  <td className="text-xs py-2 px-4 border-b">{venta.productoDescripcion}</td>                  
                  <td className="text-xs py-2 px-4 border-b">{venta.productoNumeroIMEI}</td>
                  <td className="text-xs py-2 px-4 border-b">{venta.productoNumeroICCID}</td>
                  <td className="text-xs py-2 px-4 border-b">{venta.plan}</td>
                  <td className="text-xs py-2 px-4 border-b">{venta.UserName + " " + venta.UserApPat}</td> 
                  <td className="text-xs py-2 px-4 border-b">{venta.operadorCedente}</td>
                  <td className="text-xs py-2 px-4 border-b">{venta.modalidadPortabilidad}</td>
                  <td className="text-xs py-2 px-4 border-b">{venta.montoRentaAdelantada}</td>
                  <td className="text-xs py-2 px-4 border-b">{venta.montoPagoInicial}</td>
                  <td className="text-xs py-2 px-4 border-b">{venta.importeCancelado}</td>
                  <td className="text-xs py-2 px-4 border-b">{venta.boletaFactura+"-"+venta.numeroSerieBoletaFactura}</td>
                  <td className="text-xs py-2 px-4 border-b">JUNIN</td>
                  <td className="text-xs py-2 px-4 border-b">{venta.observaciones}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {showVentaForm && <MostrarVentaForm venta={selectedVenta} setShowVentaForm={setShowVentaForm} showVentaForm={showVentaForm} handleBuscarClick={handleBuscarClick} setSelectedVenta={setSelectedVenta}/>}
        </div>
        
      )}
      <div>
      {totales.length > 0 && (
  <div className="mt-4">
    <h3 className="text-lg font-medium mb-2">Resumen de Ventas por Almacén</h3>
    <table className="w-full text-xs bg-white table-auto">
      <thead>
        <tr className="bg-gray-200">
          <th className="py-2 px-4 border-b">Almacén</th>
          <th className="py-2 px-4 border-b">Cantidad de Ventas</th>
          <th className="py-2 px-4 border-b">Suma de Rentas Adelantadas</th>
          <th className="py-2 px-4 border-b">Suma de Pagos Iniciales</th>
          <th className="py-2 px-4 border-b">Suma de Pagos Totales</th>
        </tr>
      </thead>
      <tbody>
        {totales.map(([almacen, datos]) => (
          <tr key={almacen} className="text-center">
            <td className="py-2 px-4 border-b">{almacen}</td>
            <td className="py-2 px-4 border-b">{datos.ventas}</td>
            <td className="py-2 px-4 border-b">{datos.rentasAdelantadas.toFixed(2)}</td>
            <td className="py-2 px-4 border-b">{datos.pagosIniciales.toFixed(2)}</td>
            <td className="py-2 px-4 border-b">{datos.pagosTotales.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
      </div>
    </div>
  );
};

export default MostrarVentas;
