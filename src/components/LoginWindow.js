import React, { useState } from "react";
import axios from "axios";
import logo from "../logo.svg";
import "./LoginWindow.css";
import { API, API2 } from "../Accesos";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import Loader from "./support/Loader";

const LoginWindow = ({ onLogin, setVendedor }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPass, setMostrarPass] = useState(false);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [viewLoader, setViewLoader] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowError(false);
    setViewLoader(true);

    try {
      axios
        .get(API2, {
          params: {
            usuario: username,
            password: password,
          },
        })
        .then(function (response) {
          if (response.data.status === "true") {
            onLogin();
            try {
              axios
                .get(API, {
                  params: {
                    dni: username,
                  },
                })
                .then(function (response) {
                  setVendedor(response.data[0]);
                });
            } catch (error) {}
          } else {
            setError(response.data.status);
            setShowError(true);
            setViewLoader(false);
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    } catch (error) {
      setError("Ocurrió un error al iniciar sesión");
      setShowError(true);
      setViewLoader(false);
    }
  };
  const handleUChange = (e) => {
    e.preventDefault();
    setShowError(true);
    setUsername(e.target.value);
  };
  const handlePChange = (e) => {
    e.preventDefault();
    setShowError(true);
    setPassword(e.target.value);
  };

  return (
    <div className="login-container">
      <div className="login-form flex items-center justify-center">
        <img className="w-full my-20 mt-20 logo" src={logo} alt="Logo" />

        <h1 className="title">Iniciar Sesión</h1>
        {viewLoader === true ? (
          <Loader />
        ) : (
          showError && <p className="error-message">{error}</p>
        )}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center"
        >
          <div className="input-field">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => handleUChange(e)}
              required
              placeholder="Usuario"
            />
          </div>
          <div className="input-field">
            <div className="relative">
              <input
                type={mostrarPass === true ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => handlePChange(e)}
                required
                placeholder="Contraseña"
              />
              <div className="absolute right-3 top-6 transform -translate-y-2">
                {password.length < 6 ? null : mostrarPass === false ? (
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
          <button type="submit" className="submit-button">
            <span>Iniciar Sesión</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginWindow;
