import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchInput from "./RepartirAlmacen/SearchInput";
import ProductList from "./RepartirAlmacen/ProductListTienda";
import { API8, API9} from "../Accesos";
import Loader from "./support/Loader";

const TransferProductsComponent = () => {

  // Estado para los productos
  const [productos, setProductos] = useState([]);
  const [productosNoSeleccionados, setProductosNoSeleccionados] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);

  
  const [cargando, setCargando] = useState(false);

  // Estado para los errores
  const [error, setError] = useState(null);


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
        </div>
      )}
    </>
  );
};

export default TransferProductsComponent;
