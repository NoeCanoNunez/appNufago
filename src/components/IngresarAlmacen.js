import React, { useState, useEffect } from "react";
import {
  PlusCircleIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import BigInteger from "big-integer";
import axios from "axios";
import { API6 } from "../Accesos";
import Loader from "./support/Loader";

const ProductForm = () => {
  const [mostrarLoader, setMostrarLoader] = useState(false);
  const [guiaRemision, setGuiaRemision] = useState("");
  const [nuevaGuiaRemision, setNuevaGuiaRemision] = useState("");
  const [fechaGuia, setFechaGuia] = useState("");
  const [codigoTransportista, setCodigoTransportista] = useState("");
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    codigo: "",
    cantidad: 1,
    descripcion: "",
    numeroSerie: "",
    almacen: "oficina",
  });
  const [loteInicio, setLoteInicio] = useState("");
  const [cantidadLote, setCantidadLote] = useState("");
  const [productosAgrupadosData, setProductosAgrupadosData] = useState([]);
  const [guiasRemision, setGuiasRemision] = useState([]);
  const [idGuia, setIdGuia] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAgregarProducto = () => {
    setProductos((prevState) => [...prevState, nuevoProducto]);
    setNuevoProducto({
      codigo: "",
      cantidad: 1,
      descripcion: "",
      numeroSerie: "",
    });
  };

  const handleRemoverProducto = (codigo, numeroSerie) => {
    setProductos((prevState) =>
      prevState.filter(
        (producto) =>
          !(producto.codigo === codigo && producto.numeroSerie === numeroSerie)
      )
    );
  };

  const handleAgregarLote = () => {
    const loteProductos = [];

    const loteInicioConCeros = loteInicio.replace(/\D/g, "").padStart(18, "0");
    const inicioNumerico = BigInteger(loteInicioConCeros);

    const cantidad = parseInt(cantidadLote);

    for (let i = 0; i < cantidad; i++) {
      const numeroSerie = inicioNumerico.add(BigInteger(i)).toString();

      loteProductos.push({
        codigo: nuevoProducto.codigo,
        cantidad: 1,
        descripcion: nuevoProducto.descripcion,
        numeroSerie,
      });
    }

    setProductos((prevState) => [...prevState, ...loteProductos]);
    setLoteInicio("");
    setCantidadLote("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMostrarLoader(true)

    const formData = {
      idGuia: idGuia ? idGuia : null,
      guiaRemision: nuevaGuiaRemision ? nuevaGuiaRemision : guiaRemision,
      fechaGuia,
      codigoTransportista,
      productos,
    };

    try {
      const response = await axios.post(API6, formData);
      alert(response.data.productos.map(producto => `
      ${producto.producto.numeroSerie} ${producto.status} ${producto.message}`))
      setProductos([])
      setGuiaRemision("")
      setFechaGuia("")
      setCodigoTransportista("")
      setMostrarLoader(false)
    } catch (error) {
      alert(error);
      setMostrarLoader(false)
    }
  };

  const agruparProductosPorCodigo = () => {
    const productosAgrupados = {};

    productos.forEach((producto) => {
      const { codigo, cantidad, descripcion, numeroSerie } = producto;

      if (!productosAgrupados[codigo]) {
        productosAgrupados[codigo] = {
          codigo,
          descripcion,
          cantidadTotal: 0,
          numeros: [],
          abierto: false, // Inicialmente plegado
        };
      }

      productosAgrupados[codigo].cantidadTotal += parseInt(cantidad);
      productosAgrupados[codigo].numeros.push(numeroSerie);
    });

    return Object.values(productosAgrupados);
  };

  const handleToggleGrupo = (index) => {
    setProductosAgrupadosData((prevState) =>
      productosAgrupadosData.map((grupo, i) =>
        i === index ? { ...grupo, abierto: !grupo.abierto } : grupo
      )
    );
  };

  useEffect(() => {
    setProductosAgrupadosData(agruparProductosPorCodigo());
  }, [productos]); // Dependencia en el array de productos

  useEffect(() => {
    setMostrarLoader(true)
    const fetchGuiasRemision = async () => {
      try {
        const response = await axios.get(API6);
        setGuiasRemision(response.data);
      } catch (error) {
        console.error(error);
      }
      setMostrarLoader(false)
    };

    fetchGuiasRemision();
  }, []);

  useEffect(() => {
    const selectedGuia = guiasRemision.find(
      (guia) => guia.guiaRemision === guiaRemision
    );
    if (selectedGuia) {
      setIdGuia(selectedGuia.idGuia)
      setFechaGuia(selectedGuia.fechaGuia);
      setCodigoTransportista(selectedGuia.codigoTransportista);
    } else {
      setFechaGuia("");
      setCodigoTransportista("");
    }
  }, [guiaRemision]);

  return (
    <>
    {mostrarLoader ? <Loader /> : (
     <div className="text-xs bg-white/70 p-4 rounded-xl mx-auto max-w-full shadow-2xl shadow-black/70">
     <div className="text-xs bg-rose-500 p-2 sm:p-4 rounded-t-lg mx-auto max-w-full">
       <h2 className="text-lg font-medium text-white"> Ingresar Productos al Almacen</h2>
     </div>
    
    <form
      onSubmit={handleSubmit}
      className="text-xs bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      <div className="text-xs mb-4">
        <label
          className="text-xs block text-gray-700 font-bold mb-2"
          htmlFor="guiaRemision"
        >
          Número de Guía de Remisión
        </label>
        <select
          className="text-xs shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="guiaRemision"
          value={guiaRemision}
          onChange={(e) => setGuiaRemision(e.target.value)}
        >
          <option value="">Crear nueva guía de remisión</option>
          {guiasRemision.map((guia) => (
            <option key={guia.idGuia} value={guia.guiaRemision}>
              {guia.guiaRemision}
            </option>
          ))}
        </select>
        {guiaRemision === "" && (
          <input
            className="text-xs shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
            type="text"
            placeholder="Ingrese el número de la nueva guía de remisión"
            value={nuevaGuiaRemision}
            onChange={(e) => setNuevaGuiaRemision(e.target.value)}
          />
        )}
      </div>
      <div className="text-xs mb-4">
        <label
          className="text-xs block text-gray-700 font-bold mb-2"
          htmlFor="fechaGuia"
        ></label>
        <label
          className="text-xs block text-gray-700 font-bold mb-2"
          htmlFor="fechaGuia"
        >
          Fecha de Guía
        </label>
        <input
          className="text-xs shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="fechaGuia"
          type="date"
          value={fechaGuia}
          onChange={(e) => setFechaGuia(e.target.value)}
        />
      </div>
      <div className="text-xs mb-4">
        <label
          className="text-xs block text-gray-700 font-bold mb-2"
          htmlFor="codigoTransportista"
        >
          Nombre del DAC de compra
        </label>
        <input
          className="text-xs shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="codigoTransportista"
          type="text"
          placeholder="Ingrese el nombre del DAC"
          value={codigoTransportista}
          onChange={(e) => setCodigoTransportista(e.target.value)}
        />
      </div>
      <div className="text-xs mb-4">
        <h2 className=" text-xl font-bold mb-2">Productos</h2>
        <div className="text-xs grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label
              className="text-xs block text-gray-700 font-bold mb-2"
              htmlFor="codigo"
            >
              Código
            </label>
            <input
              className="text-xs shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="codigo"
              type="text"
              placeholder="Código"
              name="codigo"
              value={nuevoProducto.codigo}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              className="text-xs block text-gray-700 font-bold mb-2"
              htmlFor="cantidad"
            >
              Cantidad
            </label>
            <input
              className="text-xs shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="cantidad"
              type="number"
              placeholder="Cantidad"
              name="cantidad"
              value={nuevoProducto.cantidad}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              className="text-xs block text-gray-700 font-bold mb-2"
              htmlFor="descripcion"
            >
              Descripción
            </label>
            <input
              className="text-xs shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="descripcion"
              type="text"
              placeholder="Descripción"
              name="descripcion"
              value={nuevoProducto.descripcion}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              className="text-xs block text-gray-700 font-bold mb-2"
              htmlFor="numeroSerie"
            >
              Número de Serie
            </label>
            <input
              className="text-xs shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="numeroSerie"
              type="text"
              placeholder="Número de Serie"
              name="numeroSerie"
              value={nuevoProducto.numeroSerie}
              onChange={handleChange}
            />
          </div>
        </div>
        <button
          type="button"
          className="text-xs bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center mt-4"
          onClick={handleAgregarProducto}
        >
          <PlusCircleIcon className="text-xs h-5 w-5 mr-2" />
          Agregar Producto
        </button>
      </div>
      <div className="text-xs mb-4">
        <h2 className=" text-xl font-bold mb-2">Agregar Lote de Productos</h2>
        <div className="text-xs grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              className="text-xs block text-gray-700 font-bold mb-2"
              htmlFor="codigo"
            >
              Código
            </label>
            <input
              className="text-xs shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="codigo"
              type="text"
              placeholder="Código"
              name="codigo"
              value={nuevoProducto.codigo}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              className="text-xs block text-gray-700 font-bold mb-2"
              htmlFor="descripcion"
            >
              Descripción
            </label>
            <input
              className="text-xs shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="descripcion"
              type="text"
              placeholder="Descripción"
              name="descripcion"
              value={nuevoProducto.descripcion}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="text-xs grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label
              className="text-xs block text-gray-700 font-bold mb-2"
              htmlFor="loteInicio"
            >
              Inicio del Lote
            </label>
            <input
              className="text-xs shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="loteInicio"
              type="text"
              placeholder="Ej: 895110163123456000"
              value={loteInicio}
              onChange={(e) => setLoteInicio(e.target.value)}
            />
          </div>
          <div>
            <label
              className="text-xs block text-gray-700 font-bold mb-2"
              htmlFor="cantidadLote"
            >
              Cantidad de Productos
            </label>
            <input
              className="text-xs shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="cantidadLote"
              type="number"
              placeholder="Cantidad"
              value={cantidadLote}
              onChange={(e) => setCantidadLote(e.target.value)}
            />
          </div>
        </div>
        <button
          type="button"
          className="text-xs bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center mt-4"
          onClick={handleAgregarLote}
        >
          <PlusCircleIcon className="text-xs h-5 w-5 mr-2" />
          Agregar Lote
        </button>
      </div>
      <div className="text-xs mb-4">
        <h2 className=" text-xl font-bold mb-2">Productos Ingresados</h2>
        {productosAgrupadosData.length > 0 ? (
          <ul>
            {productosAgrupadosData.map((grupo, index) => (
              <li key={index} className="text-xs mb-4">
                <div className="text-xs bg-gray-100 rounded-md p-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-700 font-bold">
                      {grupo.codigo} - {grupo.descripcion}
                    </p>
                    <p className="text-xs text-gray-500">
                      Cantidad Total: {grupo.cantidadTotal}
                    </p>
                  </div>
                  {grupo.abierto ? (
                    <ChevronUpIcon
                      className="text-xs h-6 w-6 text-gray-500 cursor-pointer"
                      onClick={() => handleToggleGrupo(index)}
                    />
                  ) : (
                    <ChevronDownIcon
                      className="text-xs h-6 w-6 text-gray-500 cursor-pointer"
                      onClick={() => handleToggleGrupo(index)}
                    />
                  )}
                </div>
                {grupo.abierto && (
                  <ul className="text-xs mt-2">
                    {grupo.numeros.map((numero, i) => (
                      <li
                        key={i}
                        className="text-xs flex items-center justify-between bg-gray-200 rounded-md p-2 mb-2"
                      >
                        <p className="text-xs text-gray-700">
                          Número de Serie: {numero}
                        </p>
                        <button
                          type="button"
                          className="text-xs bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                          onClick={() =>
                            handleRemoverProducto(grupo.codigo, numero)
                          }
                        >
                          <TrashIcon className="text-xs h-5 w-5 mr-2" />
                          Remover
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-gray-500">No hay productos ingresados.</p>
        )}
      </div>
      <div className="text-xs flex items-center justify-between">
        <button
          className="text-xs bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Guardar
        </button>
      </div>
    </form>
  
  </div>
  )}
  </>
  );
};

export default ProductForm;
