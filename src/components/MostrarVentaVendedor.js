import React, { useEffect, useState } from "react";
import axios from "axios";
import { API5 } from "../Accesos";
import Loader from "./support/Loader";
import { ordenarPor } from "../Helper";

const MostrarVentaVendedor = ({ vendedor }) => {
  const [mostrarLoader, setMostrarLoader] = useState(false);
  const [ventas, setVentas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(getFechaAyer());
  const [fechaFinal, setFechaFinal] = useState(getFechaAyer());

  const [selectedVenta, setSelectedVenta] = useState(null);

  const [totales, setTotales] = useState([]);


  const ventasPorAlmacen = ventas.reduce((acc, venta) => {
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
      if (vendedor.rol === "SUPERVISOR") {
        setVentas(
          ordenarPor(
            response.data,
            ["fechaVenta", "idUsuario"],
            ["ASCENDENTE", "DESCENDENTE"]
          )
        );
      } else {
        setVentas(
          ordenarPor(
            response.data,
            ["fechaVenta", "idUsuario"],
            ["ASCENDENTE", "DESCENDENTE"]
          ).filter((venta) => venta.idUsuario === vendedor.id)
        );
      }
      setMostrarLoader(false);
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

  useEffect(() => {
    setTotales(Object.entries(ventasPorAlmacen))
  }, [ventas])
  

  return (
    <div className="text-xs bg-white/70 p-4 rounded-xl mx-auto max-w-full shadow-2xl shadow-black/70">
      <div className="text-xs bg-purple-600 p-2 sm:p-4 rounded-t-lg mx-auto max-w-full">
        <h2 className= "text-lg font-medium text-white"> Buscador de Venta</h2>
      </div>
      <div className="text-xs flex my-4">
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
          className="text-xs bg-blue-500 sm:text-base hover:bg-blue-600 text-white font-bold py-2 px-4 ml-2 rounded"
          onClick={handleBuscarClick}
        >
          Buscar
        </button>
      </div>
      {mostrarLoader ? (
        <Loader />
      ) : (
        <div className="text-xs overflow-auto max-w-full max-h-[80vh] pb-4">
          <table className="text-xs bg-white table-auto w-auto max-w-full max-h-full overflow-scroll">
            <thead>
              <tr className="text-xs sticky top-0 bg-white sm:text-base">
                <th className="text-xs py-2 px-4 border-b">FechaVenta</th>
                <th className="text-xs py-2 px-4 border-b">PDV</th>
                <th className="text-xs py-2 px-4 border-b">Usuario</th>
                <th className="text-xs py-2 px-4 border-b">TD</th>
                <th className="text-xs py-2 px-4 border-b">#Doc</th>
                <th className="text-xs py-2 px-4 border-b">Nombre</th>
                <th className="text-xs py-2 px-4 border-b">Ap. Paterno</th>
                <th className="text-xs py-2 px-4 border-b">Ap. Materno</th>
                <th className="text-xs py-2 px-4 border-b">Chip Pack</th>
                <th className="text-xs py-2 px-4 border-b">Tipo de Operación</th>
                <th className="text-xs py-2 px-4 border-b">Plazo</th>
                <th className="text-xs py-2 px-4 border-b">Plan</th>
                <th className="text-xs py-2 px-4 border-b">Número de Celular</th>
                <th className="text-xs py-2 px-4 border-b">Número de Referencia</th>
                <th className="text-xs py-2 px-4 border-b">Boleta/Factura</th>
                <th className="text-xs py-2 px-4 border-b">
                  Número de Serie Boleta/Factura
                </th>
                <th className="text-xs py-2 px-4 border-b">ICCID</th>
                <th className="text-xs py-2 px-4 border-b">Nombre ICCID</th>
                <th className="text-xs py-2 px-4 border-b">IMEI Equipo Venta</th>
                <th className="text-xs py-2 px-4 border-b">Nombre Equipo</th>
                <th className="text-xs py-2 px-4 border-b">Número Sec</th>
                <th className="text-xs py-2 px-4 border-b">Operador Cedente</th>
                <th className="text-xs py-2 px-4 border-b">Modalidad Portabilidad</th>
                <th className="text-xs py-2 px-4 border-b">Monto Renta Adelantada</th>
                <th className="text-xs py-2 px-4 border-b">Monto Pago Inicial</th>
                <th className="text-xs py-2 px-4 border-b">Importe Cancelado</th>
                <th className="text-xs py-2 px-4 border-b">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta, index) => (
                <tr
                  key={venta.id}
                  className={`bg-${
                    index % 2 === 0 ? "gray-100" : "white"
                  } sm:text-base text-xs ${
                    selectedVenta?.id === venta.id ? "bg-yellow-200" : ""
                  }`}
                  onClick={() => setSelectedVenta(venta)}
                >
                  <td className="text-xs py-2 px-4 border-b">
                    {venta.fechaVenta.split("-").reverse().join("/")}
                  </td>
                  <td className="text-xs py-2 px-4 border-b">{venta.almacenName}</td>
                  <td className="text-xs py-2 px-4 border-b">{venta.UserName}</td>
                  <td className="text-xs py-2 px-4 border-b">{venta.ClienteTipoDoc}</td>
                  <td className="text-xs py-2 px-4 border-b">{venta.ClienteNumDoc}</td>
                  <td className="text-xs py-2 px-4 border-b">
                    {venta.ClienteNameOrRS}
                  </td>
                  <td className="text-xs py-2 px-4 border-b">
                    {venta.clienteApPaterno}
                  </td>
                  <td className="text-xs py-2 px-4 border-b">
                    {venta.clienteApMaterno}
                  </td>
                  <td className="text-xs py-2 px-4 border-b">{venta.chipPack}</td>
                  <td className="text-xs py-2 px-4 border-b">{venta.tipoOperacion}</td>
                  <td className="text-xs py-2 px-4 border-b">{venta.plazo}</td>
                  <td className="text-xs py-2 px-4 border-b">{venta.plan}</td>
                  <td className="text-xs py-2 px-4 border-b">{venta.numeroCelular}</td>
                  <td className="text-xs py-2 px-4 border-b">
                    {venta.numeroReferencia}
                  </td>
                  <td className="text-xs py-2 px-4 border-b">{venta.boletaFactura}</td>
                  <td className="text-xs py-2 px-4 border-b">
                    {venta.numeroSerieBoletaFactura}
                  </td>
                  <td className="text-xs py-2 px-4 border-b">
                    {venta.productoNumeroICCID}
                  </td>
                  <td className="text-xs py-2 px-4 border-b">
                    {venta.productoNumeroIMEI}
                  </td>
                  <td className="text-xs py-2 px-4 border-b">
                    {venta.productoDescripcion}
                  </td>
                  <td className="text-xs py-2 px-4 border-b">{venta.numeroSec}</td>
                  <td className="text-xs py-2 px-4 border-b">
                    {venta.operadorCedente}
                  </td>
                  <td className="text-xs py-2 px-4 border-b">
                    {venta.modalidadPortabilidad}
                  </td>
                  <td className="text-xs py-2 px-4 border-b">
                    {venta.montoRentaAdelantada}
                  </td>
                  <td className="text-xs py-2 px-4 border-b">
                    {venta.montoPagoInicial}
                  </td>
                  <td className="text-xs py-2 px-4 border-b">
                    {venta.importeCancelado}
                  </td>
                  <td className="text-xs py-2 px-4 border-b">{venta.observaciones}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
                <tr key={almacen}>
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
  );
};

export default MostrarVentaVendedor;
