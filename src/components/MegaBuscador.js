import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./support/Loader";
import { differenceInDays, format, parseISO } from "date-fns";
import { API11, API9 } from "../Accesos";

const MegaBuscador = () => {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState("");
  const [valorBusqueda, setValorBusqueda] = useState("");
  const [resultadosEspecificos, setResultadosEspecificos] = useState([]);
  const [mostrarLoader, setMostrarLoader] = useState(false);
  const [almacenes, setAlmacenes] = useState([]);

  const opciones = ["Seleccione", "IMEI", "ICCID"];

  const handleBusqueda = async (id) => {
    setMostrarLoader(true);
    try {
      const respuesta = await axios.get(`${API11}?numeroSerie=${id}`);
      console.log(respuesta.data);
      setResultadosEspecificos(respuesta.data);
      setMostrarLoader(false);
    } catch (error) {
      console.error("Error en la búsqueda específica:", error);
      setMostrarLoader(false);
    }
  };

  const obtenerAlmacenes = async () => {
    try {
      setMostrarLoader(true);
      const respuesta = await axios.get(API9);
      console.log(respuesta.data);
      setAlmacenes(respuesta.data);
    } catch (error) {
      alert("no se pudo conectar al servidor" + error);
    } finally {
      setMostrarLoader(false);
    }
  };

  useEffect(() => {
    obtenerAlmacenes();
  }, []);

  function calcularAntiguedad(fechaGuia) {
    const fechaGuiaParsed = parseISO(fechaGuia);
    const hoy = new Date();
  
    const antiguedadEnDias = differenceInDays(hoy, fechaGuiaParsed);
  
    return (
      <Linear
        par={true}
        title="Antiguedad"
        data={`${antiguedadEnDias} días`}
      />
    );
  }

  return mostrarLoader ? (
    <Loader />
  ) : (
    <div className="text-xs bg-white/70 p-4 rounded-xl mx-auto max-w-full shadow-2xl shadow-black/70">
      <div className="text-xs bg-purple-600 p-2 sm:p-4 rounded-t-lg mx-auto max-w-full">
        <h2 className="text-lg font-medium text-white"> MEGA BUSCADOR</h2>
      </div>
      <div className="container mx-auto py-8">
        <div className="flex flex-wrap justify-center w-full items-center mb-4 gap-1">
          <select
            className="form-select mr-4  py-2 rounded-md shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={opcionSeleccionada}
            onChange={(e) => setOpcionSeleccionada(e.target.value)}
          >
            {opciones.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="form-input mr-4 px-4 py-2 rounded-md shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={valorBusqueda}
            onChange={(e) => setValorBusqueda(e.target.value)}
            placeholder="Ingrese el valor de búsqueda"
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-max"
            onClick={() => handleBusqueda(valorBusqueda)}
          >
            Buscar
          </button>
        </div>
        {mostrarLoader ? (
          <Loader />
        ) : (
          <div className="flex flex-col pl-2">
            {resultadosEspecificos.length !== 0 && (
              <>
                <div className="w-full">
                  <h2 className="text-xl font-semibold mb-2">DETALLES</h2>
                  <Linear
                    par={true}
                    title="Fecha Guía"
                    data={resultadosEspecificos[0].fechaGuia}
                  />
                  {calcularAntiguedad(resultadosEspecificos[0].fechaGuia)}
                  <Linear
                    title="Guía Remisión"
                    data={resultadosEspecificos[0].guiaRemision}
                  />
                  <Linear
                    par={true}
                    title="Código"
                    data={resultadosEspecificos[0].codigo}
                  />
                  <Linear
                    title="Descripción"
                    data={resultadosEspecificos[0].descripcion}
                  />
                  <Linear
                    par={true}
                    title="Número de Serie"
                    data={resultadosEspecificos[0].numeroSerie}
                  />
                  <Linear
                    title="Estado"
                    data={resultadosEspecificos[0].estado}
                  />
                  <Linear
                    par={true}
                    title="Código Transportista"
                    data={resultadosEspecificos[0].codigoTransportista}
                  />
                  <Linear
                    title="Vendedor"
                    data={resultadosEspecificos[0].nombres}
                  />
                  <Linear
                    par={true}
                    title="Almacén"
                    data={resultadosEspecificos[0].almacen}
                  />
                  <Linear
                    title="Fecha Venta"
                    data={resultadosEspecificos[0].fechaVenta}
                  />
                  <Linear
                    par={true}
                    title="Chip Pack"
                    data={resultadosEspecificos[0].chipPack}
                  />
                  <Linear
                    title="Tipo de Operación"
                    data={resultadosEspecificos[0].tipoOperacion}
                  />
                  <Linear
                    par={true}
                    title="Plazo"
                    data={resultadosEspecificos[0].plazo}
                  />
                  <Linear title="Plan" data={resultadosEspecificos[0].plan} />
                  <Linear
                    par={true}
                    title="Número de Celular"
                    data={resultadosEspecificos[0].numeroCelular}
                  />
                  <Linear
                    title="Número de Referencia"
                    data={resultadosEspecificos[0].numeroReferencia}
                  />
                  <Linear
                    par={true}
                    title="Boleta/Factura"
                    data={resultadosEspecificos[0].boletaFactura}
                  />
                  <Linear
                    title="Número de Serie Boleta/Factura"
                    data={resultadosEspecificos[0].numeroSerieBoletaFactura}
                  />
                  <Linear
                    par={true}
                    title="Número Sec"
                    data={resultadosEspecificos[0].numeroSec}
                  />
                  <Linear
                    title="Operador Cedente"
                    data={resultadosEspecificos[0].operadorCedente}
                  />
                  <Linear
                    par={true}
                    title="Modalidad de Portabilidad"
                    data={resultadosEspecificos[0].modalidadPortabilidad}
                  />
                  <Linear
                    title="Monto Renta Adelantada"
                    data={resultadosEspecificos[0].montoRentaAdelantada}
                  />
                  <Linear
                    par={true}
                    title="Monto Pago Inicial"
                    data={resultadosEspecificos[0].montoPagoInicial}
                  />
                  <Linear
                    title="Importe Cancelado"
                    data={resultadosEspecificos[0].importeCancelado}
                  />
                  <Linear
                    par={true}
                    title="Observaciones"
                    data={resultadosEspecificos[0].observaciones}
                  />
                  <Linear
                    title="Número de Documento"
                    data={resultadosEspecificos[0].numeroDocumento}
                  />
                  <Linear
                    par={true}
                    title="Tipo de Documento"
                    data={resultadosEspecificos[0].tipoDocumento}
                  />
                  <Linear
                    title="Nombre o Razón Social"
                    data={
                      resultadosEspecificos[0].nameOrRS
                        ? resultadosEspecificos[0].nameOrRS +
                          " " +
                          resultadosEspecificos[0].apPaterno +
                          " " +
                          resultadosEspecificos[0].apMaterno
                        : ""
                    }
                  />
                </div>
                <div className="w-full  mt-5">
                  <h2 className="text-xl font-semibold mb-2">TRANSACCIONES</h2>
                  {resultadosEspecificos[0].TransacInternas.map(
                    (res, index) => (
                      <div key={index}>
                        <Linear
                          par={index % 2 === 0 ? true : false}
                          title="Fecha Asignacion"
                          data={res.fechaAsignacion}
                        />
                        <Linear
                          par={index % 2 === 0 ? true : false}
                          title="Desde"
                          data={
                            almacenes.find(
                              (almacen) =>
                                Number(almacen.id) ===
                                Number(res.idAlmacenActual)
                            ).almacen
                          }
                        />
                        <Linear
                          par={index % 2 === 0 ? true : false}
                          title="Para"
                          data={
                            almacenes.find(
                              (almacen) =>
                                Number(almacen.id) ===
                                Number(res.idAlmacenDestino)
                            ).almacen
                          }
                        />
                      </div>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MegaBuscador;

const Linear = ({ title, data, par }) => {
  return (
    <div
      className={
        "flex flex-wrap align-middle " +
        (par === true ? " bg-indigo-50" : "bg-white")
      }
    >
      <h4 className="font-bold sm:w-[250px] w-[100px] w-max-1/2 md:text-sm text-xs align-middle">
        {title}:{" "}
      </h4>
      <span className="md:w-max-1/2 md:text-sm text-xs align-middle items-center">
        {data ? data : "-"}
      </span>
    </div>
  );
};
