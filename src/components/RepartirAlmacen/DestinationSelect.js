// DestinationSelect.jsx
import React from 'react';

const DestinationSelect = ({ almacenDestino, setAlmacenDestino, almacenes }) => {


  const handleChange = (e) => {
    setAlmacenDestino(e.target.value);
  };

  return (
    <div className="mb-4">
      <label htmlFor="almacenDestino" className="block font-bold mb-2 mt-5">
        Almacén de Destino
      </label>
      <select
        id="almacenDestino"
        className="border border-gray-300 rounded py-2 px-4 w-full"
        value={almacenDestino || ''}
        onChange={handleChange}
      >
        <option value="">---Seleccionar Almacén---</option>
        {almacenes.map((almacen) => (
          <option key={almacen.id} value={almacen.id}>
            {almacen.almacen}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DestinationSelect;