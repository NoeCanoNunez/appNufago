import React, { useState, useEffect } from "react";
import axios from "axios";
import InputField from "./UsersForm/InputField";
import { API } from "../Accesos";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import Loader from "./support/Loader";

const UsersForm = () => {
  const [users, setUsers] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [mostrarPass, setMostrarPass] = useState(false);
  const [viewLoader, setViewLoader] = useState(true);

  useEffect(() => {
  axios
    .get(API)
    .then((response) => {
      setUsers(response.data.filter(objeto => objeto.idAlmacen > 0
      ));
      setAlmacenes(response.data.filter(objeto => !objeto.idAlmacen))
      setViewLoader(false);
    })
    .catch((error) => {
      console.error(
        "Hubo un error al obtener los datos de los usuarios:",
        error
      );
    });
}, []);

useEffect(() => {
  console.log(almacenes)
}, [almacenes])


  const userInitial = {
    dni: "",
    nombres: "",
    apPaterno: "",
    apMaterno: "",
    sexo: "M",
    fechaNacimiento: "",
    celular: "",
    direccion: "",
    email: "",
    usuario: "",
    password: "",
    rol: "ADMINISTRATIVO",
    idAlmacen: "1",
    estado: "1",
  };
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState(userInitial);

  const handleAddUser = () => {
    setEditingUser(null);
    setNewUser(userInitial);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({
      id: user.dni,
      dni: user.dni,
      nombres: user.nombres,
      apPaterno: user.apPaterno,
      apMaterno: user.apMaterno,
      sexo: user.sexo,
      fechaNacimiento: user.fechaNacimiento,
      celular: user.celular,
      direccion: user.direccion,
      email: user.email,
      usuario: user.usuario,
      password: user.password,
      rol: user.rol,
      idAlmacen: user.idAlmacen,
      estado: user.estado,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = { ...newUser }; // Crear una copia del objeto newUser

    try {
      if (editingUser) {
        // Si estamos editando un usuario existente
        await axios.put(`${API}?id=${editingUser.id}`, user);
        setUsers(users.map((u) => (u.id === editingUser.id ? user : u)));
      } else {
        // Si estamos creando un nuevo usuario
        const response = await axios.post(API, user);
        setUsers([...users, response.data]);
      }
      setShowModal(false);
      setNewUser(userInitial);
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
    }
  };

  const handleChange = (e) => {
    let value =
      e.target.name === "nombres" || e.target.name === "direccion"
        ? e.target.value.trimStart()
        : e.target.value.trim();

    // Verificar si el valor no es un correo electrónico o un número
    if (
      !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value) &&
      isNaN(value)
    ) {
      value =
        e.target.name === "password" ? value : (value = value.toUpperCase());
    }

    // Si estamos creando un nuevo usuario y estamos modificando el DNI
    if (!editingUser && e.target.name === "dni") {
      // Verificar si el DNI ya existe en la lista de usuarios
      const dniExists = users.some((user) => user.dni === value);

      if (dniExists) {
        // Si el DNI ya existe, mostrar una alerta y no actualizar el estado
        alert("El DNI ya existe.");
        return;
      }
    }

    setNewUser({ ...newUser, [e.target.name]: value });
  };

  return (
    <>
      {viewLoader ? (
        <Loader />
      ) : (
        <div className="lg:min-h-screen min-h-2 py-0 lg:py-6 flex flex-col justify-center sm:py-12">
          <div className="relative lg:py-3 py-0.5 sm:max-w-xl sm:mx-auto -mx-7">
            <div className="relative px-2 py-10 lg:px-20 shadow-black/20 shadow-lg  lg:py-10 bg-white mx-8 md:mx-0 rounded-3xl sm:p-10">
              <div className="max-w-md mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="sm:text-2xl text-xl sm:pl-10 pl-2 font-semibold text-indigo-900">
                    Gestión de Usuarios
                  </h2>
                  <button
                    onClick={handleAddUser}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg sm:text-lg text-xs"
                  >
                    <p className="hidden text-xs sm:flex">Agregar</p>
                    <p className="hidden text-xs sm:flex">Usuario</p>
                    <p className="sm:hidden text-xs block">+Usuario</p>
                  </button>
                </div>
                <div className="divide-y divide-gray-200">
                  {users.map((user) => (
                    
                    <div
                      key={user.id}
                      className="py-4 flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <img
                          src={`https://ui-avatars.com/api/?name=${
                            user.nombres + " " + user.apPaterno
                          }&background=random`}
                          alt={user.nombres}
                          className="w-10 h-10 rounded-full mr-4"
                        />
                        <div>
                          <h3 className="text-base font-medium text-gray-800">
                            {user.nombres}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {user.rol} - {almacenes.filter(almacen => Number(almacen.id) === Number(user.idAlmacen))[0].almacen.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-indigo-500 hover:text-indigo-600 mr-4"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {showModal && (
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
                  className="inline-block  align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg max-w-full w-80 sm:w-full"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-headline"
                >
                  <form onSubmit={handleSubmit}>
                    <div className="bg-indigo-600 px-4 py-3 sm:px-6 flex flex-row justify-between">
                      <h2 className="text-lg font-medium text-white">
                        {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
                      </h2>
                      <button
                        onClick={() => setShowModal(false)}
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
                    <div
                      className="bg-indigo-50 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 
              grid grid-cols-2 md:grid-cols-3 gap-3 "
                    >
                      <InputField
                        labelText="DNI"
                        id="dni"
                        type="text"
                        name="dni"
                        value={newUser.dni}
                        onChange={handleChange}
                      />

                      <InputField
                        CN="col-span-2"
                        labelText="Nombres"
                        id="nombres"
                        type="text"
                        name="nombres"
                        value={newUser.nombres}
                        onChange={handleChange}
                      />
                      <InputField
                        labelText="Ap. Paterno"
                        id="apPaterno"
                        type="text"
                        name="apPaterno"
                        value={newUser.apPaterno}
                        onChange={handleChange}
                      />
                      <InputField
                        labelText="Ap. Materno"
                        id="apMaterno"
                        type="text"
                        name="apMaterno"
                        value={newUser.apMaterno}
                        onChange={handleChange}
                      />
                      <InputField
                        labelText="Sexo"
                        id="sexo"
                        type="select"
                        name="sexo"
                        value={newUser.sexo}
                        onChange={handleChange}
                        options={[
                          { value: "M", label: "Masculino" },
                          { value: "F", label: "Femenino" },
                        ]}
                      />
                      <InputField
                        labelText="Fecha Nacimiento"
                        id="fechaNacimiento"
                        type="date"
                        name="fechaNacimiento"
                        value={newUser.fechaNacimiento}
                        onChange={handleChange}
                      />
                      <InputField
                        labelText="Celular"
                        id="celular"
                        type="text"
                        name="celular"
                        value={newUser.celular}
                        onChange={handleChange}
                      />
                      <InputField
                        labelText="Dirección"
                        id="direccion"
                        type="text"
                        name="direccion"
                        value={newUser.direccion}
                        onChange={handleChange}
                      />
                      <InputField
                        labelText="Email"
                        id="email"
                        type="email"
                        name="email"
                        value={newUser.email}
                        onChange={handleChange}
                      />
                      <InputField
                        labelText="Usuario"
                        id="usuario"
                        type="text"
                        name="usuario"
                        value={newUser.usuario}
                        onChange={handleChange}
                      />

                      <div className="col-span-1">
                        <div className="relative">
                          <InputField
                            labelText="Password"
                            id="password"
                            type={mostrarPass === true ? "text" : "password"}
                            name="password"
                            value={newUser.password}
                            onChange={handleChange}
                            className="pr-8" // Añade un padding a la derecha para evitar la superposición con el icono
                          />
                          <div className="absolute right-2 top-2 transform -translate-y-2">
                            {mostrarPass === false ? (
                              <EyeIcon
                                onClick={() => setMostrarPass(!mostrarPass)}
                                className="h-6 w-6 cursor-pointer"
                              />
                            ) : (
                              <EyeSlashIcon
                                onClick={() => setMostrarPass(!mostrarPass)}
                                className="h-6 w-6 cursor-pointer"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      <InputField
                        labelText="Rol"
                        id="rol"
                        type="select"
                        name="rol"
                        value={newUser.rol}
                        onChange={handleChange}
                        options={[
                          { value: "ADMINISTRATIVO", label: "Administrativo" },
                          { value: "SUPERVISOR", label: "Supervisor" },
                          { value: "VENDEDOR", label: "Vendedor" },
                        ]}
                      />
                      <InputField
                        labelText="Tienda"
                        id="idAlmacen"
                        type="select"
                        name="idAlmacen"
                        value={newUser.idAlmacen}
                        onChange={handleChange}
                        options={almacenes.map((u) => ({value: u.id , label: u.almacen}))}
                      />
                      <InputField
                        labelText="Estado"
                        id="estado"
                        type="select"
                        name="estado"
                        value={newUser.estado}
                        onChange={handleChange}
                        options={[
                          { value: "1", label: "Activo" },
                          { value: "0", label: "Inactivo" },
                        ]}
                      />
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit "
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setShowModal(false)}
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default UsersForm;
