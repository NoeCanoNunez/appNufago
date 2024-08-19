import React, { useState } from 'react';

const ProductList = ({
  productos,
  productosSeleccionados,
  agregarProductoSeleccionado,
  removerProductoSeleccionado,
}) => {
  const isProductoSeleccionado = (producto) => {
    return productosSeleccionados.some((p) => p.idProducto === producto.idProducto);
  };

  const classfont = "text-left text-xs font-medium text-gray-700 uppercase tracking-wider";

  return (
    <div className="bg-rose-200 rounded-xl max-w-[90vw] overflow-x-auto max-h-[30vh] mb-4">
      <table className="table-auto w-full">
        <thead>
          <tr className='sticky top-0 bg-white sm:text-base text-xs'>
            <th className="px-4 py-2  text-xs">F.Ingreso</th>
            <th className="px-4 py-2  text-xs">Descripción</th>
            <th className="px-4 py-2  text-xs">Número de Serie</th>
            <th className="px-4 py-2  text-xs">Opción</th>
            <th className="px-4 py-2  text-xs">Almacen</th>
            <th className="px-4 py-2  text-xs">F.Asignacion</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.idProducto} className='sm:text-base text-xs text-center'>
              <td className={classfont + " border sm:px-4 px-1.5 py-2"}>{`${producto.fechaGuia.split("-").reverse().join("/")}`}</td>
              <td className={classfont + " border sm:px-4 px-1.5 py-2"}>{producto.descripcion}</td>
              <td className={classfont + " border sm:px-4 px-1.5 py-2"}>{producto.numeroSerie}</td>
              <td className={classfont + " border sm:px-4 px-1.5 py-2"}>
                <button
                  className={`${
                    isProductoSeleccionado(producto)
                      ? 'bg-green-500 hover:bg-green-700'
                      : 'bg-blue-500 hover:bg-blue-700'
                  } text-white font-bold py-2 px-4 rounded`}
                  onClick={() =>
                    isProductoSeleccionado(producto)
                      ? removerProductoSeleccionado(producto)
                      : agregarProductoSeleccionado(producto)
                  }
                >
                  {isProductoSeleccionado(producto) ? '-' : '+'}
                </button>
              </td>
              <td className={classfont + " border sm:px-4 px-1.5 py-2"}>{producto.almacen}</td>
              <td className={classfont + " border sm:px-4 px-1.5 py-2"}>{producto.fechaAsignacion ? producto.TransacInternas.slice(-1)[0].fechaAsignacion.split("-").reverse().join("/") : "No Asignado"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const App = ({ productos, productosSeleccionados, agregarProductoSeleccionado, removerProductoSeleccionado }) => {
  const [view, setView] = useState('IMEI');

  const productosIMEI = productos.filter(producto => producto.numeroSerie.length < 18);
  const productosICCID = productos.filter(producto => producto.numeroSerie.length >= 18);

  console.log(productos[500])

  return (
    <div>
      <div className="flex justify-center mb-4">
        <button
          className={`mx-2 px-4 py-2 font-bold text-white rounded ${view === 'IMEI' ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-500 hover:bg-gray-700'}`}
          onClick={() => setView('IMEI')}
        >
          Productos IMEI
        </button>
        <button
          className={`mx-2 px-4 py-2 font-bold text-white rounded ${view === 'ICCID' ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-500 hover:bg-gray-700'}`}
          onClick={() => setView('ICCID')}
        >
          Productos ICCID
        </button>
      </div>

      {view === 'IMEI' ? (
        <ProductList 
          productos={productosIMEI} 
          productosSeleccionados={productosSeleccionados}
          agregarProductoSeleccionado={agregarProductoSeleccionado}
          removerProductoSeleccionado={removerProductoSeleccionado}
        />
      ) : (
        <ProductList 
          productos={productosICCID} 
          productosSeleccionados={productosSeleccionados}
          agregarProductoSeleccionado={agregarProductoSeleccionado}
          removerProductoSeleccionado={removerProductoSeleccionado}
        />
      )}
    </div>
  );
};

export default App;
