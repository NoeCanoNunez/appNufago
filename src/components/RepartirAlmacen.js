import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchInput from "./RepartirAlmacen/SearchInput";
import ProductList from "./RepartirAlmacen/ProductList";
import { API8, API9, API10 } from "../Accesos";
import Loader from "./support/Loader";
import InputField from "./UsersForm/InputField";

const TransferProductsComponent = () => {
  function getFechaHoy() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate());

    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, "0");
    const day = String(yesterday.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // Estado para los productos
  const [productos, setProductos] = useState([]);
  const [productosNoSeleccionados, setProductosNoSeleccionados] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);

  // Estado para el almacén de destino
  const [almacenDestino, setAlmacenDestino] = useState(null);
  const [fechaAsignacion, setFechaAsignacion] = useState(getFechaHoy());
  // Estado para la carga de datos
  const [cargando, setCargando] = useState(false);

  // Estado para los errores
  const [error, setError] = useState(null);

  //Estado para reiniciar todo
  const [refresh, setRefresh] = useState(false);

  // Función para obtener los productos de la API8
  const obtenerProductos = async () => {
    try {
      setCargando(true);
      const respuesta = await axios.get(API8);
      setProductos(respuesta.data);
      setProductosNoSeleccionados(respuesta.data.filter(producto => producto.idAlmacen === 1));
    } catch (error) {
      setError("Error al obtener los productos");
    } finally {
      setCargando(false);
    }
  };

  // Función para obtener los almacenes de la API9
  const obtenerAlmacenes = async () => {
    try {
      setCargando(true);
      const respuesta = await axios.get(API9);
      setAlmacenes(respuesta.data);
    } catch (error) {
      setError("Error al obtener los almacenes");
    } finally {
      setCargando(false);
    }
  };

  // Efecto para obtener los productos y almacenes al montar el componente
  useEffect(() => {
    obtenerProductos();
    obtenerAlmacenes();
  }, []);

  useEffect(() => {
    obtenerProductos();
    obtenerAlmacenes();
  }, [refresh]);

  useEffect(() => {
    console.log(productosSeleccionados);
    console.log(almacenDestino);
    console.log(productosNoSeleccionados);
  }, [productosSeleccionados, almacenDestino, productosNoSeleccionados]);

  // Función para filtrar los productos por número de serie o descripción
  const filtrarProductos = (filtro, valor) => {
    const productosFiltrados = productos.filter((producto) =>
      producto[filtro]
        .toString()
        .toLowerCase()
        .includes(valor.toString().toLowerCase())
    );
    setProductosNoSeleccionados(productosFiltrados);
  };

  // Función para agregar un producto a la lista de seleccionados
  const agregarProductoSeleccionado = (producto) => {
    setProductosSeleccionados([...productosSeleccionados, producto]);
    setProductosNoSeleccionados(
      productosNoSeleccionados.filter((p) => p !== producto)
    );
  };

  // Función para remover un producto de la lista de seleccionados
  const removerProductoSeleccionado = (producto) => {
    setProductosSeleccionados(
      productosSeleccionados.filter((p) => p !== producto)
    );
    setProductosNoSeleccionados([...productosNoSeleccionados, producto]);
  };

  // Función para enviar la solicitud PUT a la API9
  const transferirProductos = async () => {
    try {
      setCargando(true);
      const datos = {
        idAlmacen: Number(almacenDestino),
        fechaAsignacion,
        productos: productosSeleccionados,
      };
      const response = await axios.put(API10, datos);
      alert(response.data.status);

      setAlmacenDestino("");
      setAlmacenes([]);
      setProductos([]);
      setProductosSeleccionados([]);
      setProductosNoSeleccionados([]);
      setRefresh(!refresh);
    } catch (error) {
      setError("Error al transferir los productos");
    } finally {
      setCargando(false);
    }
  };

  const classfont = "text-left text-xs font-medium text-gray-700 uppercase tracking-wider"


  return (
    <>
      {cargando ? (
        <Loader />
      ) : (
        <div className="bg-white/70 p-4 rounded-xl mx-auto max-w-full shadow-2xl shadow-black/70">
          <div className="bg-emerald-600 p-2 sm:p-4 rounded-t-lg mx-auto max-w-full">
            <h2 className="text-lg font-medium text-white">
              {" "}
              Transferir Productos
            </h2>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="mt-5 mb-4 flex flex-row justify-evenly">
            <div>
              <select
                className="sm:text-base text-xs  border-gray-300 rounded-l focus:ring focus:border-blue-300 bg-gradient-to-r from-purple-50 via-pink-50 to-red-50 hover:from-pink-50 hover:via-purple-50 hover:to-red-50 font-bold rounded-r flex shadow appearance-none border rounded w-full py-1.5 px-1 sm:py-2 sm:px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="selectAlmacen"
                id="almacenSelect"
                onChange={(e) => filtrarProductos("idAlmacen", e.target.value)}
              >
                {almacenes.map((almacen) => (
                  <option value={almacen.id}>{almacen.almacen}</option>
                ))}
              </select>
            </div>
            <SearchInput
              placeholder="Busca # serie"
              onSearch={(valor) => filtrarProductos("numeroSerie", valor)}
            />
            <SearchInput
              placeholder="Buscar por NOMBRE"
              onSearch={(valor) => filtrarProductos("descripcion", valor)}
            />
          </div>

          <ProductList
            productos={productosNoSeleccionados}
            productosSeleccionados={productosSeleccionados}
            agregarProductoSeleccionado={agregarProductoSeleccionado}
            removerProductoSeleccionado={removerProductoSeleccionado}
          />

          {/* Tabla de productos seleccionados */}
          <div className="mt-8 overflow-x-auto max-h-[30vh] ">
            <h2 className="lock font-bold mb-2">Productos Seleccionados: {Object.keys(productosSeleccionados).length}</h2>
            <div className="overflow-x-auto">
              <table className="table-auto w-full bg-green-100">
                <thead>
                  <tr className="sticky top-0 bg-white sm:text-base text-xs  ">
                    <th className="px-4 py-2  text-xs">F.Ingreso</th>
                    <th className="px-4 py-2  text-xs">Descripción</th>
                    <th className="px-4 py-2  text-xs">Número de Serie</th>
                    <th className="px-4 py-2  text-xs">Opción</th>
                    <th className="px-4 py-2  text-xs">Almacen</th>
                    <th className="px-4 py-2  text-xs">F.Asignacion</th>
                  </tr>
                </thead>
                <tbody>
                  {productosSeleccionados.map((producto) => (
                    <tr
                      key={producto.idProducto}
                      className="sm:text-base text-xs text-center"
                    >
                      <td className={classfont + " border sm:px-4 px-1.5 py-2"}>
                        {producto.fechaGuia.split("-").reverse().join("/")}
                      </td>
                      <td className={classfont + " border sm:px-4 px-1.5 py-2"}>
                        {producto.descripcion}
                      </td>
                      <td className={classfont + " border sm:px-4 px-1.5 py-2"}>
                        {producto.numeroSerie}
                      </td>
                      <td className={classfont + " border sm:px-4 px-1.5 py-2"}>
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                          onClick={() => removerProductoSeleccionado(producto)}
                        >
                          -
                        </button>
                      </td>
                      <td className={classfont + " border sm:px-4 px-1.5 py-2"}>{producto.almacen}</td>
                      <td className={classfont + " border sm:px-4 px-1.5 py-2"}>{producto.fechaAsignacion ? producto.TransacInternas.slice(-1)[0].fechaAsignacion.split("-").reverse().join("/") : "No Asignado"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 overflow-x-auto max-h-[30vh] ">
            <h2 className="lock font-bold mb-2">Destino</h2>

            <div className="flex flex-row justify-evenly">
              <InputField
                labelText="Fecha Asignación"
                id="fechaAsignacion"
                type="date"
                name="fechaAsignacion"
                value={fechaAsignacion}
                onChange={(e) => setFechaAsignacion(e.target.value)}
              />
              <InputField
                labelText="Almacen Destino"
                id="almacenDestino"
                type="select"
                name="almacenDestino"
                value={almacenDestino || ""}
                onChange={(e) => setAlmacenDestino(e.target.value)}
                options={almacenes.map((u) => ({
                  value: u.id,
                  label: u.almacen,
                }))}
              />
              {/* <DestinationSelect
            almacenDestino={almacenDestino}
            setAlmacenDestino={setAlmacenDestino}
            almacenes={almacenes}
          /> */}
            </div>
          </div>
          <div className="text-center my-2">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={transferirProductos}
              disabled={cargando || productosSeleccionados.length === 0}
            >
              {cargando ? "Transfiriendo..." : "Transferir Productos"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TransferProductsComponent;
