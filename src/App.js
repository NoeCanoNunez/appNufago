import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import "./App.css";
import LoginWindow from "./components/LoginWindow";
import UIX from "./components/UIX";
import backgroundImage from "./city.jpg"; // Asegúrate de que la ruta sea correcta

function App() {
  const vendedorInicial = {
    id: 0,
    dni: "",
    nombres: "",
    apPaterno: "",
    apMaterno: "",
    sexo: "",
    fechaNacimiento: "",
    celular: "",
    direccion: "",
  };
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [vendedor, setVendedor] = useState(vendedorInicial);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div
      className="App"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <Transition
        show={isLoggedIn}
        enter="transition-all duration-1000 transform ease-in-out"
        enterFrom="opacity-0 scale-75"
        enterTo="opacity-100 scale-100"
        leave="transition-all duration-1000 transform ease-in-out"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-75"
      >
        <UIX vendedor={vendedor} />
      </Transition>
      <Transition
        show={!isLoggedIn}
        enter="transition-all duration-1000 transform ease-in-out"
        enterFrom="opacity-0 scale-75"
        enterTo="opacity-100 scale-100"
        leave="transition-all duration-1000 transform ease-in-out"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-75"
      >
        <LoginWindow onLogin={handleLogin} setVendedor={setVendedor} />
      </Transition>
    </div>
  );
}

export default App;
