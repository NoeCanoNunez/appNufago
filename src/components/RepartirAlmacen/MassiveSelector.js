import React, { useState } from 'react';

const MassiveSelector = ({
  productos,
  productosSeleccionados,
  agregarProductosConsecutivos,
}) => {
  const [numeroSerie, setNumeroSerie] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [error, setError] = useState(null);

  const handleNumeroSerieChange = (e) => {
    setNumeroSerie(e.target.value);
    setError(null);
  };

  const handleCantidadChange = (e) => {
    setCantidad(parseInt(e.target.value, 10) || 1);
    setError(null);
  };

  const validarSeleccion = () => {
    const productoInicial = productos.find(
      (producto) => producto.numeroSerie === numeroSerie
    );

    if (!productoInicial) {
      setError('Número de serie no encontrado');
      return false;
    }

    const productosDisponibles = productos.filter(
      (producto) =>
        producto.numeroSerie >= productoInicial.numeroSerie &&
        !productosSeleccionados.some((p) => p.idProducto === producto.idProducto)
    );

    if (productosDisponibles.length < cantidad) {
      setError(
        `Sólo hay ${productosDisponibles.length} productos disponibles consecutivos`
      );
      return false;
    }

    return true;
  };

  const handleSeleccion = () => {
    if (validarSeleccion()) {
      agregarProductosConsecutivos(numeroSerie, cantidad);
      setNumeroSerie('');
      setCantidad(1);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center mb-2">
        <input
          type="text"
          placeholder="Ingresar número de serie inicial"
          className="border border-gray-300 rounded py-2 px-4 mr-2"
          value={numeroSerie}
          onChange={handleNumeroSerieChange}
        />
        <input
          type="number"
          min="1"
          placeholder="Cantidad de elementos"
          className="border border-gray-300 rounded py-2 px-4 mr-2"
          value={cantidad}
          onChange={handleCantidadChange}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSeleccion}
        >
          Añadir
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default MassiveSelector;