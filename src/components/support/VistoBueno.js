import React, { useEffect, useRef, useState } from "react";
import "./VistoBueno.css";

const VistoBueno = () => {
  const checkboxRef = useRef(null);
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    setMostrar(true);
    const timer = setTimeout(() => {
      setMostrar(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkbox = checkboxRef.current;
    if (checkbox) {
      checkbox.checked = true;
    }
  }, []);

  return (
    <>
      {mostrar && (
        <div className="container ">
          <div class="bg-white w-48 h-48 rounded-lg">
            <div class="flex p-2 gap-1">
              <div class="">
                <span class="bg-blue-500 inline-block center w-3 h-3 rounded-full"></span>
              </div>
              <div class="circle">
                <span class="bg-purple-500 inline-block center w-3 h-3 rounded-full"></span>
              </div>
              <div class="circle">
                <span class="bg-pink-500 box inline-block center w-3 h-3 rounded-full"></span>
              </div>
            </div>
            <div class="card__content flex flex-col justify-center items-center">
              <label>
                <input type="checkbox" ref={checkboxRef} />
                <div className="checkmark"></div>
              </label>
              <p className="text-success text-center">
                Venta subida Correctamente
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VistoBueno;
