import React, { useState, useEffect } from "react";
import axios from "axios";
import { API4, API3 } from "../../Accesos";
import {
  MagnifyingGlassIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid";
import Loader from "../support/Loader";

const MostrarVentaForm = ({ venta, setShowVentaForm, showVentaForm, handleBuscarClick, setSelectedVenta }) => {
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

  let fechaVenta = new Date();
  fechaVenta.setHours(fechaVenta.getHours() - 5);
  fechaVenta = fechaVenta.toISOString().split("T")[0];
  const [form, setForm] = useState(venta);
  const [cliente, setCliente] = useState(null);
  const [mostrarLoader, setMostrarLoader] = useState(false);

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await axios.get(
          `${API4}?tipoDocumento=${venta.ClienteTipoDoc}&numeroDocumento=${venta.ClienteNumDoc}`
        );
        setCliente(response.data[0]);
      } catch (error) {
        alert(error);
      }
    };

    fetchCliente();
  }, [showVentaForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleChangeCliente = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMostrarLoader(true);

    try {
      const response = await axios.put(`${API3}?id=${form.id}`, form);

      if (response.data.status === "success") {
        alert("Venta subida con éxito");
        setCliente(null);
        setForm(null)
        setShowVentaForm(!showVentaForm)
        setMostrarLoader(false);
        handleBuscarClick()
        setSelectedVenta(null)
      } else {
        alert("Error al enviar el formulario");
        setMostrarLoader(false);
      }
    } catch (error) {
      alert("Error mayor al enviar el formulario: ", error);
      setMostrarLoader(false);
    }
  };

  const handleSeekeer = async (e) => {
    e.preventDefault();
    setMostrarLoader(true);

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
          setForm({
            ...form,
            idCliente: response.data[0].id,
          });
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

  const IccidSeccion = (
    <>
      <div>
        <label className={labelInputStyle}>ICCID</label>
        <input
          name="iccid"
          type="text"
          onChange={handleChange}
          className={inputStyle}
          value={form.iccid}
        />
      </div>
      <div>
        <label className={labelInputStyle}>Nombre ICCID</label>
        <input
          name="nombreIccid"
          type="text"
          onChange={handleChange}
          className={inputStyle}
          value={form.nombreIccid}
        />
      </div>
    </>
  );

  const ImeiSeccion = (
    <>
      <div>
        <label className={labelInputStyle}>IMEI</label>
        <input
          name="imeiEquipoVenta"
          type="text"
          onChange={handleChange}
          className={inputStyle}
          value={form.imeiEquipoVenta}
        />
      </div>
      <div>
        <label className={labelInputStyle}>Nombre Equipo</label>
        <input
          name="nombreEquipo"
          type="text"
          onChange={handleChange}
          className={inputStyle}
          value={form.nombreEquipo}
        />
      </div>
    </>
  );

  return (
    <>
      {cliente &&
        (mostrarLoader ? (
          <Loader />
        ) : (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className=" flex items-end justify-center min-h-screen pt-10 pb-10 text-center sm:block sm:p-0">
              <div
                className=" fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <div
                className="inline-block  align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-[90vw] max-w-full w-80 sm:w-full shadow-black/50"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
              >
                <form onSubmit={handleSubmit}>
                  <div className="bg-indigo-600 px-4 py-3 sm:px-6 flex flex-row justify-between">
                    <h2 className="text-lg font-medium text-white">
                      Editar Venta
                    </h2>
                    <button
                      onClick={() => setShowVentaForm(!showVentaForm)}
                      type="button"
                      className="bg-rose-600 p-1 w-8 h-8 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <span className="sr-only">Close</span>
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 m-2">
                    <div className="md:col-span-2 bg-gradient-to-r from-red-50 to-orange-100 p-3 rounded-lg">
                      <h2 className="text-sm font-semibold mb-1">
                        Información del Cliente
                      </h2>

                      <div className="grid grid-cols-6 md:grid-cols-12 gap-x-1 sm:gap-3">
                        <div className="md:col-span-5 col-span-2">
                          <label className={labelInputStyle}>Tipo</label>
                          <select
                            name="tipoDocumento"
                            onChange={handleChangeCliente}
                            className={inputStyle}
                            value={cliente.tipoDocumento}
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
                              onChange={handleChangeCliente}
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
                            {cliente.tipoDocumento !== "ruc"
                              ? "Nombres"
                              : "Razón Social"}
                          </label>
                          <input
                            name="nameOrRS"
                            type="text"
                            onChange={handleChangeCliente}
                            className={inputStyle}
                            value={cliente.nameOrRS}
                          />
                        </div>
                        {cliente.tipoDocumento !== "ruc" && (
                          <div className="md:col-span-6 col-span-3">
                            <label className={labelInputStyle}>
                              Apellido Paterno
                            </label>
                            <input
                              name="apPaterno"
                              type="text"
                              onChange={handleChangeCliente}
                              className={inputStyle}
                              value={cliente.apPaterno}
                            />
                          </div>
                        )}
                        {cliente.tipoDocumento !== "ruc" && (
                          <div className="md:col-span-6 col-span-3">
                            <label className={labelInputStyle}>
                              Apellido Materno
                            </label>
                            <input
                              name="apMaterno"
                              type="text"
                              onChange={handleChangeCliente}
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
                            onChange={handleChangeCliente}
                            className={inputStyle}
                            value={cliente.direccion}
                          />
                        </div>
                        {cliente.tipoDocumento !== "ruc" && (
                          <div className="md:col-span-7 col-span-3">
                            <label className={labelInputStyle}>Correo</label>
                            <input
                              placeholder="Opcional"
                              name="correo"
                              type="text"
                              onChange={handleChangeCliente}
                              className={inputStyle}
                              value={cliente.correo}
                            />
                          </div>
                        )}
                        {cliente.tipoDocumento !== "ruc" && (
                          <div className="md:col-span-5 col-span-3">
                            <label className={labelInputStyle}>
                              {"Nacimiento(Opcional)"}
                            </label>
                            <input
                              name="fechaNacimiento"
                              type="date"
                              onChange={handleChangeCliente}
                              className={inputStyle}
                              value={cliente.fechaNacimiento}
                            />
                          </div>
                        )}

                        <div className="md:col-span-12 col-span-6 flex justify-center">
                          {!cliente.id && (
                            <div
                              className=" cursor-pointer flex items-center justify-center px-4 py-0.5 rounded-md bg-gradient-to-br from-pink-600 to-orange-600 text-white hover:bg-gradient-to-bl transition-all duration-300"
                              onClick={handleCliente}
                            >
                              <span className="mr-2">Registrar Cliente</span>
                              <ChevronDoubleRightIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2 bg-gradient-to-r from-red-50 to-orange-100 p-3 rounded-lg">
                      <h2 className="text-sm font-semibold mb-1">
                        Información del Servicio
                      </h2>
                      <div className="grid grid-cols-6 md:grid-cols-12 gap-x-1 sm:gap-3">
                        <div className="md:col-span-12 col-span-6">
                          <label className={labelInputStyle}>Fecha Venta</label>
                          <input
                            name="fechaVenta"
                            type="date"
                            onChange={handleChange}
                            className={inputStyle}
                            value={form.fechaVenta}
                          />
                        </div>
                        <div className="md:col-span-3 col-span-2">
                          <label className={labelInputStyle}>Chip o Pack</label>
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
                                <option value="migraPostpago">Migracion</option>
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
                                <option value="migraPostpago">Migracion</option>
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
                  </div>
                  <hr className="my-4" />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-2">
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
                        <div>
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
                        </div>
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
                      className="mb-10 w-28 inline-flex justify-center py-1.5 px-3 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Actualizar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ))}{" "}
    </>
  );
};

export default MostrarVentaForm;
