import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid";
import { API3, API4, API7 } from "../Accesos";
import axios from "axios";
import Loader from "./support/Loader";

const Formulario = ({ vendedor }) => {
  let fechaVenta = new Date();
  fechaVenta.setHours(fechaVenta.getHours() - 5);
  fechaVenta = fechaVenta.toISOString().split("T")[0];

  const clienteInicial = {
    id: "",
    tipoDocumento: "dni",
    numeroDocumento: "",
    nameOrRS: "",
    apPaterno: "",
    apMaterno: "",
    direccion: "",
    correo: "",
    fechaNacimiento: "",
  };
  const formInicial = {
    idUsuario: vendedor.id,
    idAlmacen: vendedor.idAlmacen,
    fechaVenta: fechaVenta,
    idCliente: "",
    chipPack: "chip",
    tipoOperacion: "",
    plazo: "",
    plan: "",
    numeroCelular: "",
    numeroReferencia: "",
    boletaFactura: "",
    numeroSerieBoletaFactura: "",
    iccid: "",
    nombreIccid: "",
    imeiEquipoVenta: "",
    nombreEquipo: "",
    numeroSec: "",
    operadorCedente: "",
    modalidadPortabilidad: "",
    montoRentaAdelantada: 0,
    montoPagoInicial: 0,
    importeCancelado: 0,
    observaciones: "",
  };
  const [form, setForm] = useState(formInicial);
  const [isSecondSectionVisible, setIsSecondSectionVisible] = useState(false);
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [mostrarLoader, setMostrarLoader] = useState(false);
  const [cliente, setCliente] = useState(clienteInicial);
  const [clienteGuardado, setclienteGuardado] = useState(false);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const axiosProductos = async () => {
      try {
        const response = await axios.get(
          `${API7}?idAlmacen=${vendedor.idAlmacen}`
        );
        setProductos(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    axiosProductos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "tipoDocumento") {
      setTipoDocumento(value);
    }

    if (
      name === "tipoDocumento" ||
      name === "numeroDocumento" ||
      name === "nameOrRS" ||
      name === "apPaterno" ||
      name === "apMaterno" ||
      name === "direccion" ||
      name === "correo" ||
      name === "fechaNacimiento"
    ) {
      setCliente({
        ...cliente,
        [e.target.name]: e.target.value,
      });
    } else {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMostrarLoader(true);

    try {
      const response = await axios.post(API3, form);

      if (response.data.status === "success") {
        alert("Venta subida con éxito");
        setForm(formInicial);
        setMostrarLoader(false);
        setIsSecondSectionVisible(false);
        setCliente(clienteInicial);
        setclienteGuardado(false);
      } else {
        alert("Error " + response.data.message);
        setMostrarLoader(false);
      }
    } catch (error) {
      alert("Error mayor al enviar el formulario: ", error);
      setMostrarLoader(false);
    }
  };

  const handleCliente = async (e) => {
    e.preventDefault();
    // Validar campos
    if (!cliente.numeroDocumento.trim()) {
      alert(
        `Por favor, ingrese un número de ${cliente.tipoDocumento.toLocaleUpperCase()} valido`
      );
      return;
    }
    if (cliente.tipoDocumento !== "ruc") {
      if (!cliente.nameOrRS.trim()) {
        alert("Por favor, ingrese Nombre(s) del Cliente");
        return;
      }
      if (!cliente.apPaterno.trim()) {
        alert(
          "Por favor, ingrese un Apellido Paterno. Si no tiene ingrese (-)"
        );
        return;
      }
      if (!cliente.apMaterno.trim()) {
        alert(
          "Por favor, ingrese un Apellido Materno. Si no tiene ingrese (-)"
        );
        return;
      }
    } else {
      if (!cliente.nameOrRS.trim()) {
        alert("Por favor, ingrese la Razón Social");
        return;
      }
    }

    if (cliente.id === "") {
      setMostrarLoader(true);
      try {
        const response = await axios.post(API4, cliente);

        if (response.status === 200) {
          setCliente({
            ...cliente,
            id: response.data.id,
          });
          alert("Cliente Registrado con éxito");
          setMostrarLoader(false);
        } else {
          alert("Error al guardar Clientes");
          setMostrarLoader(false);
        }
      } catch (error) {
        alert("Error al enviar el formulario Cliente: ", error);
        setMostrarLoader(false);
      }
    }

    setclienteGuardado(true);
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setIsSecondSectionVisible(!isSecondSectionVisible);
    setForm({
      ...form,
      idCliente: cliente.id,
      idUsuario: vendedor.id,
      idAlmacen: vendedor.idAlmacen,
    });
  };

  const handleSeekeer = async (e) => {
    e.preventDefault();
    setMostrarLoader(true);
    setclienteGuardado(false);

    try {
      const response = await axios.get(
        `${API4}?tipoDocumento=${cliente.tipoDocumento}&numeroDocumento=${cliente.numeroDocumento}`
      );

      if (response.status === 200) {
        if (response.data.length > 0) {
          setCliente((prevCliente) => ({
            ...prevCliente,
            ...response.data[0],
          }));
        } else {
          setCliente((prevCliente) => ({
            ...clienteInicial,
            tipoDocumento: prevCliente.tipoDocumento,
            numeroDocumento: prevCliente.numeroDocumento,
          }));
        }

        setMostrarLoader(false);
      } else {
        alert("Error al guardar Clientes");
        setMostrarLoader(false);
      }
    } catch (error) {
      alert("Cliente no Encontrado: ", error);
      setMostrarLoader(false);
    }
  };

  const inputStyle =
    "mt-1 block w-full mb-1 py-0.5 px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs";
  const labelInputStyle = "block text-xs font-medium text-gray-700 -mb-1 ml-1";

  /* ************************ICCID SECTION************************ */
  const [iccidOptions, setIccidOptions] = useState([]);
  const handleChangeIccid = (e) => {
    const value = e.target.value;
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (value.length >= 5) {
      const filteredOptions = productos
        .filter((producto) =>
          producto.numeroSerie.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5);
      setIccidOptions(filteredOptions);
    } else {
      setIccidOptions([]);
    }
  };
  const onclickICCID = (e) => {
    setForm({
      ...form,
      iccid: e.target.getAttribute("value"),
    });
    setIccidOptions([]);
  };
  const onclickSeekerICCID = () => {
    setIccidOptions([]);
    const nombreIccidC = productos.filter(producto => producto.numeroSerie === form.iccid)
    if (nombreIccidC.length === 1) {
      setForm({
        ...form,
        nombreIccid: nombreIccidC[0].descripcion
      });
      alert("♥♥♥Iccid Encontrado♥♥♥")
    } else {
      alert("El numero de ICCID ingresado es incorrecto")
      setForm({
        ...form,
        nombreIccid: ""
      });
    }
  };
  const IccidSeccion = (
    <>
      <div>
        <label className={labelInputStyle}>ICCID</label>
        <div className="flex mt-1">
          <input
            name="iccid"
            type="text"
            onChange={handleChangeIccid}
            className={`pl-2 rounded-l-md flex-grow border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500  text-xs`}
            value={form.iccid}
            required
            autoComplete="off"
          />
          <div
            className="cursor-pointer bg-gradient-to-br from-pink-600 to-orange-600 flex-shrink-0 px-1.5 rounded-r-md border "
            onClick={onclickSeekerICCID}
          >
            <MagnifyingGlassIcon className="h-5 w-5  text-white" />
          </div>
        </div>
        {iccidOptions.length > 0 && (
          <ul className="absolute z-10 bg-white border border-gray-300 rounded -mt-1">
            {iccidOptions.map((option, index) => (
              <li
                key={index}
                value={option.numeroSerie}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={onclickICCID}
              >
                {option.numeroSerie}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <label className={labelInputStyle}>Nombre ICCID</label>
        <input
          name="nombreIccid"
          type="text"
          className={inputStyle + " bg-slate-100"}
          value={form.nombreIccid}
          required
        />
      </div>
    </>
  );

  const [imeiOptions, setImeiOptions] = useState([]);
  const handleChangeImei = (e) => {
    const value = e.target.value;
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    if (value.length >= 5) {
      const filteredOptions = productos
        .filter((producto) =>
          producto.numeroSerie.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5);
      setImeiOptions(filteredOptions);
    } else {
      setImeiOptions([]);
    }
  };
  const onclickIMEI = (e) => {
    setForm({
      ...form,
      imeiEquipoVenta: e.target.getAttribute("value"),
    });
    setImeiOptions([]);
  };
  const onclickSeekerIMEI = () => {
    setImeiOptions([]);

    const nombreIImeiC = productos.filter(producto => producto.numeroSerie == form.imeiEquipoVenta)
    if (nombreIImeiC.length === 1) {
      setForm({
        ...form,
        nombreEquipo: nombreIImeiC[0].descripcion
      });
      alert("♪♫♪IMEI Encontrado♪♫♪")
    } else {
      alert("El numero de IMEI ingresado es incorrecto")
      setForm({
        ...form,
        nombreEquipo: ""
      });
    }
  };
  const ImeiSeccion = (
    <>
      <div>
        <label className={labelInputStyle}>IMEI</label>
        <div className="flex mt-1">
        <input
          name="imeiEquipoVenta"
          type="text"
          onChange={handleChangeImei}
          className={`pl-2 rounded-l-md flex-grow border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500  text-xs`}
          value={form.imeiEquipoVenta}
          required
          autoComplete="off"
        />
        <div
          className="cursor-pointer bg-gradient-to-br from-pink-600 to-orange-600 flex-shrink-0 px-1.5 rounded-r-md border "
          onClick={onclickSeekerIMEI}
        >
          <MagnifyingGlassIcon className="h-5 w-5  text-white" />
        </div>
        </div>
        {imeiOptions.length > 0 && (
          <ul className="absolute z-10 bg-white border border-gray-300 rounded -mt-1">
            {imeiOptions.map((option, index) => (
              <li
                key={index}
                value={option.numeroSerie}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={(e) => onclickIMEI(e)}
              >
                {option.numeroSerie}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <label className={labelInputStyle}>Nombre Equipo</label>
        <input
          name="nombreEquipo"
          type="text"
          onChange={handleChangeImei}
          className={inputStyle + " bg-slate-100"}
          value={form.nombreEquipo}
          readOnly
          required
        />
      </div>
    </>
  );

  return (
    <>
      {mostrarLoader ? (
        <Loader />
      ) : (
        <>
          <div className="bg-amber-600 p-2 sm:p-4 rounded-t-lg mx-auto max-w-4xl">
            <h2 className="text-lg font-medium text-white">
              {" "}
              Formulario de Venta
            </h2>
          </div>
          <div className="bg-white p-4 rounded-b-lg mx-auto max-w-4xl shadow-2xl shadow-black/70">
            <form onSubmit={handleSubmit}>
              {!isSecondSectionVisible && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2 bg-gradient-to-r from-red-50 to-orange-100 p-3 rounded-lg">
                      <h2 className="text-sm font-semibold mb-1">
                        Información del Cliente
                      </h2>

                      <div className="grid grid-cols-6 md:grid-cols-12 gap-x-1 sm:gap-3">
                        <div className="md:col-span-5 col-span-2">
                          <label className={labelInputStyle}>Tipo</label>
                          <select
                            name="tipoDocumento"
                            onChange={handleChange}
                            className={inputStyle}
                            value={form.tipoDocumento}
                          >
                            <option value="dni">DNI</option>
                            <option value="ce">CARNET EXTRANJERIA</option>
                            <option value="pp">PASAPORTE</option>
                            <option value="ruc">RUC</option>
                          </select>
                        </div>
                        <div className="md:col-span-7 col-span-4">
                          <label className={labelInputStyle}>
                            Número de Documento
                          </label>
                          <div className="flex mt-1">
                            <input
                              name="numeroDocumento"
                              type="text"
                              onChange={handleChange}
                              className={`pl-2 rounded-l-md flex-grow border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500  text-xs`}
                              value={cliente.numeroDocumento}
                            />
                            <div
                              className="cursor-pointer bg-gradient-to-br from-pink-600 to-orange-600 flex-shrink-0 px-1.5 rounded-r-md border "
                              onClick={handleSeekeer}
                            >
                              <MagnifyingGlassIcon className="h-5 w-5  text-white" />
                            </div>
                          </div>
                        </div>
                        <div className="md:col-span-12 col-span-6">
                          <label className={labelInputStyle}>
                            {tipoDocumento !== "ruc"
                              ? "Nombres"
                              : "Razón Social"}
                          </label>
                          <input
                            name="nameOrRS"
                            type="text"
                            onChange={handleChange}
                            className={inputStyle}
                            value={cliente.nameOrRS}
                          />
                        </div>
                        {tipoDocumento !== "ruc" && (
                          <div className="md:col-span-6 col-span-3">
                            <label className={labelInputStyle}>
                              Apellido Paterno
                            </label>
                            <input
                              name="apPaterno"
                              type="text"
                              onChange={handleChange}
                              className={inputStyle}
                              value={cliente.apPaterno}
                            />
                          </div>
                        )}
                        {tipoDocumento !== "ruc" && (
                          <div className="md:col-span-6 col-span-3">
                            <label className={labelInputStyle}>
                              Apellido Materno
                            </label>
                            <input
                              name="apMaterno"
                              type="text"
                              onChange={handleChange}
                              className={inputStyle}
                              value={cliente.apMaterno}
                            />
                          </div>
                        )}
                        <div className="md:col-span-12 col-span-6">
                          <label className={labelInputStyle}>Dirección</label>
                          <input
                            placeholder="Opcional"
                            name="direccion"
                            type="text"
                            onChange={handleChange}
                            className={inputStyle}
                            value={cliente.direccion}
                          />
                        </div>
                        {tipoDocumento !== "ruc" && (
                          <div className="md:col-span-7 col-span-3">
                            <label className={labelInputStyle}>Correo</label>
                            <input
                              placeholder="Opcional"
                              name="correo"
                              type="text"
                              onChange={handleChange}
                              className={inputStyle}
                              value={cliente.correo}
                            />
                          </div>
                        )}
                        {tipoDocumento !== "ruc" && (
                          <div className="md:col-span-5 col-span-3">
                            <label className={labelInputStyle}>
                              {"Nacimiento(Opcional)"}
                            </label>
                            <input
                              name="fechaNacimiento"
                              type="date"
                              onChange={handleChange}
                              className={inputStyle}
                              value={cliente.fechaNacimiento}
                            />
                          </div>
                        )}

                        <div className="md:col-span-12 col-span-6 flex justify-center">
                          <div
                            className=" cursor-pointer flex items-center justify-center px-4 py-0.5 rounded-md bg-gradient-to-br from-pink-600 to-orange-600 text-white hover:bg-gradient-to-bl transition-all duration-300"
                            onClick={handleCliente}
                          >
                            <span className="mr-2">Continuar</span>
                            <ChevronDoubleRightIcon className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                    {clienteGuardado && (
                      <div className="md:col-span-2 bg-gradient-to-r from-red-50 to-orange-100 p-3 rounded-lg">
                        <h2 className="text-sm font-semibold mb-1">
                          Información del Servicio
                        </h2>
                        <div className="grid grid-cols-6 md:grid-cols-12 gap-x-1 sm:gap-3">
                          <div className="md:col-span-12 col-span-6">
                            <label className={labelInputStyle}>
                              Fecha Venta
                            </label>
                            <input
                              name="fechaVenta"
                              type="date"
                              onChange={handleChange}
                              className={inputStyle}
                              value={form.fechaVenta}
                              readOnly
                            />
                          </div>
                          <div className="md:col-span-3 col-span-2">
                            <label className={labelInputStyle}>
                              Chip o Pack
                            </label>
                            <select
                              name="chipPack"
                              onChange={handleChange}
                              className={inputStyle}
                              value={form.chipPack}
                            >
                              <option value="chip">Chip</option>
                              <option value="pack">Pack</option>
                              <option value="cuotas">Cuotas</option>
                            </select>
                          </div>
                          <div className="md:col-span-5 col-span-2">
                            <label className={labelInputStyle}>Operación</label>

                            <select
                              name="tipoOperacion"
                              onChange={handleChange}
                              className={inputStyle}
                              value={form.tipoOperacion}
                            >
                              <option value="">--elija--</option>
                              {form.chipPack === "chip" ? (
                                <>
                                  <option value="altaPrepago">
                                    Alta Prepago
                                  </option>
                                  <option value="altaPostpago">
                                    Alta Postpago
                                  </option>
                                  <option value="portaPrepago">
                                    Porta Prepago
                                  </option>
                                  <option value="portaPostpago">
                                    Porta Postpago
                                  </option>
                                  <option value="repuPrepago">
                                    Chip Repu Pre
                                  </option>
                                  <option value="repuPostpago">
                                    Chip Repu Post
                                  </option>
                                  <option value="migraPostpago">
                                    Migracion
                                  </option>
                                </>
                              ) : form.chipPack === "pack" ? (
                                <>
                                  <option value="altaPrepago">
                                    Alta Prepago
                                  </option>
                                  <option value="altaPostpago">
                                    Alta Postpago
                                  </option>
                                  <option value="portaPrepago">
                                    Porta Prepago
                                  </option>
                                  <option value="portaPostpago">
                                    Porta Postpago
                                  </option>
                                  <option value="renoPrepago">
                                    Reno Prepago
                                  </option>
                                  <option value="renoPostpago">
                                    Reno Postpago
                                  </option>
                                  <option value="migraPostpago">
                                    Migracion
                                  </option>
                                  <option value="HFC-FTTH">HFC/FTTH</option>
                                </>
                              ) : (
                                <>
                                  <option value="altaPostpago">
                                    Alta Postpago
                                  </option>
                                  <option value="portaPostpago">
                                    Porta Postpago
                                  </option>
                                  <option value="renoPostpago">
                                    Reno Postpago
                                  </option>
                                </>
                              )}
                            </select>
                          </div>
                          <div className="md:col-span-4 col-span-2">
                            <label className={labelInputStyle}>Plazo</label>
                            <select
                              name="plazo"
                              onChange={handleChange}
                              className={inputStyle}
                              value={form.plazo}
                            >
                              <option value="">--elija--</option>
                              {form.tipoOperacion.endsWith("Prepago") && (
                                <option value="prepago">Prepago</option>
                              )}
                              {form.tipoOperacion.endsWith("Postpago") &&
                                form.chipPack === "chip" && (
                                  <option value="indeterminado">
                                    Plazo Indeterminado
                                  </option>
                                )}
                              {form.tipoOperacion.endsWith("Postpago") &&
                                form.chipPack === "pack" && (
                                  <option value="18m">18 meses</option>
                                )}
                              {form.tipoOperacion.endsWith("Postpago") &&
                                form.chipPack === "cuotas" && (
                                  <>
                                    <option value="6m">6 meses</option>
                                    <option value="12m">12 meses</option>
                                  </>
                                )}
                              {form.tipoOperacion === "HFC-FTTH" && (
                                <option value="6m">6 meses</option>
                              )}
                            </select>
                          </div>
                          {(!form.tipoOperacion.endsWith("Prepago") &&
                          form.tipoOperacion !== "repuPostpago"
                            ? true
                            : false) && (
                            <div className="md:col-span-4 col-span-2">
                              <label className={labelInputStyle}>
                                {"Plan(S/.)"}
                              </label>
                              <input
                                name="plan"
                                type="text"
                                onChange={handleChange}
                                className={inputStyle}
                                value={form.plan}
                              />
                            </div>
                          )}
                          <div className="md:col-span-4 col-span-2">
                            <label className={labelInputStyle}>
                              # de Celular
                            </label>
                            <input
                              name="numeroCelular"
                              type="text"
                              onChange={handleChange}
                              className={inputStyle}
                              value={form.numeroCelular}
                            />
                          </div>
                          <div className="md:col-span-4 col-span-2">
                            <label className={labelInputStyle}>
                              # de Referencia
                            </label>
                            <input
                              placeholder="opcional"
                              name="numeroReferencia"
                              type="text"
                              onChange={handleChange}
                              className={inputStyle}
                              value={form.numeroReferencia}
                            />
                          </div>
                          <div className="md:col-span-6 col-span-3">
                            <label className={labelInputStyle}>
                              Boleta/Factura
                            </label>
                            <select
                              name="boletaFactura"
                              onChange={handleChange}
                              className={inputStyle}
                              value={form.boletaFactura}
                            >
                              <option value="">--Opcional--</option>
                              <option value="EB01-">Boleta EB01-</option>
                              <option value="EF01-">Factura EF01-</option>
                            </select>
                          </div>
                          <div className="md:col-span-6 col-span-3">
                            <label className={labelInputStyle}>
                              #Serie Comprobante
                            </label>
                            <input
                              name="numeroSerieBoletaFactura"
                              type="text"
                              onChange={handleChange}
                              className={inputStyle}
                              value={form.numeroSerieBoletaFactura}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <hr className="my-4" />
                </>
              )}
              {clienteGuardado && (
                <div className="md:col-span-3 text-center">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex justify-center py-1.5 px-3 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-green-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isSecondSectionVisible ? "Atrás" : "Siguiente"}
                  </button>
                </div>
              )}
              {/* Segunda sección del formulario */}
              {isSecondSectionVisible && (
                <>
                  <hr className="my-4" />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1 bg-gradient-to-r from-red-50 to-orange-100 p-3 rounded-lg">
                      <h2 className="text-sm font-semibold mb-1">
                        Información del Producto
                      </h2>

                      {form.chipPack === "chip" ? (
                        form.tipoOperacion === "migraPostpago" ? null : (
                          IccidSeccion
                        )
                      ) : form.chipPack === "pack" ? (
                        form.tipoOperacion.startsWith("reno") ||
                        form.tipoOperacion === "migraPostpago" ? (
                          ImeiSeccion
                        ) : form.tipoOperacion === "HFC-FTTH" ? null : (
                          <>
                            {IccidSeccion}
                            {ImeiSeccion}
                          </>
                        )
                      ) : form.chipPack === "cuotas" ? (
                        form.tipoOperacion.startsWith("reno") ? (
                          ImeiSeccion
                        ) : (
                          <>
                            {IccidSeccion}
                            {ImeiSeccion}
                          </>
                        )
                      ) : (
                        "Encontraste un error, Felicidades, llama al 968700858"
                      )}
                    </div>
                    <div className="md:col-span-2 bg-gradient-to-r from-red-50 to-orange-100 p-3 rounded-lg">
                      <h2 className="text-sm font-semibold mb-1">
                        Detalles Adicionales
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 sm:gap-3">
                        {(form.tipoOperacion.endsWith("Postpago") ||
                          form.tipoOperacion.startsWith("porta")) && (
                          <div>
                            <label className={labelInputStyle}>
                              Número de SEC
                            </label>
                            <input
                              name="numeroSec"
                              type="text"
                              onChange={handleChange}
                              className={inputStyle}
                              value={form.numeroSec}
                            />
                          </div>
                        )}
                        {form.tipoOperacion.startsWith("porta") && (
                          <>
                            <div>
                              <label className={labelInputStyle}>
                                Operador Cedente
                              </label>
                              <input
                                name="operadorCedente"
                                type="text"
                                onChange={handleChange}
                                className={inputStyle}
                                value={form.operadorCedente}
                                list="operadorCedenteList"
                                autoComplete="off"
                              />
                              <datalist id="operadorCedenteList">
                                <option value="Entel" />
                                <option value="Movistar" />
                                <option value="Bitel" />
                              </datalist>
                            </div>
                            <div>
                              <label className={labelInputStyle}>
                                Modalidad Portabilidad
                              </label>
                              <select
                                name="modalidadPortabilidad"
                                onChange={handleChange}
                                className={inputStyle}
                                value={form.modalidadPortabilidad}
                              >
                                <option value="">--elije--</option>
                                <option value="prepago">Pre a Post</option>
                                <option value="postpago">Post a Post</option>
                              </select>
                            </div>
                          </>
                        )}
                        <div>
                          <label className={labelInputStyle}>
                            Monto Renta Ad.
                          </label>
                          <input
                            name="montoRentaAdelantada"
                            type="number"
                            onChange={handleChange}
                            className={inputStyle}
                            value={form.montoRentaAdelantada}
                          />
                        </div>
                        {form.chipPack === "cuotas" && <div>
                          <label className={labelInputStyle}>
                            Monto Pago Inicial
                          </label>
                          <input
                            name="montoPagoInicial"
                            type="number"
                            onChange={handleChange}
                            className={inputStyle}
                            value={form.montoPagoInicial}
                          />
                        </div>}
                        <div>
                          <label className={labelInputStyle}>
                            Importe Cancelado
                          </label>
                          <input
                            name="importeCancelado"
                            type="number"
                            onChange={handleChange}
                            className={inputStyle}
                            value={form.importeCancelado}
                          />
                        </div>

                        <div className="md:col-span-3">
                          <label className={labelInputStyle}>
                            Observaciones
                          </label>
                          <textarea
                            placeholder="Informacion de tu HFC/FTTH o cualquier dato que quieras añadir"
                            name="observaciones"
                            onChange={handleChange}
                            className={inputStyle}
                            value={form.observaciones}
                            rows="2"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="my-4" />

                  <div className="mt-4 mr-4 text-end">
                    <button
                      type="submit"
                      className="w-28 inline-flex justify-center py-1.5 px-3 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Enviar
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default Formulario;
