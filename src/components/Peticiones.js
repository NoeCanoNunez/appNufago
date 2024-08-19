import React, { useState } from 'react';

const MiComponente = () => {
    const [inputValue, setInputValue] = useState(''); // Estado para el valor del input

    const handleClick = async () => {
        
        try {
            window.open(`https://sigof.sisfoh.gob.pe/consulta_hogares_ULE/busqueda_print.php?txtusuario=42186558&txtnro_doc=${inputValue}`);
        } catch (error) {
            console.error('Hubo un error al abrir la ventana:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <input
                type="number"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 mb-4"
            />
            <button
                onClick={handleClick}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Enviar
            </button>
            
        </div>
    );
};

export default MiComponente;