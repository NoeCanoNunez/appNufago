import React from 'react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

function BotonXlsx({ csvData, fileName }) {

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    // const exportToCSV = (csvData, fileName) => {
    //     const ws = XLSX.utils.json_to_sheet(csvData);
    //     const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    //     const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    //     const data = new Blob([excelBuffer], {type: fileType});
    //     FileSaver.saveAs(data, fileName + fileExtension);
    // }

    const exportToCSV = (csvData, fileName) => {
        // Definir las columnas que deseas incluir y el orden en el que aparecerán
        const columns = [
            { label: 'Almacén', key: 'almacenName' },
            { label: 'Vendedor', key: 'vendedor' },
            { label: 'ID', key: 'id' },
            { label: 'Fecha de Venta', key: 'fechaVenta' },
            { label: 'Tipo de Documento del Cliente', key: 'ClienteTipoDoc' },
            { label: 'Número de Documento del Cliente', key: 'ClienteNumDoc' },
            { label: 'Número de Secuencia', key: 'numeroSec' },
            { label: 'Clientes', key: 'clientes' },
            { label: 'Chip/Pack', key: 'chipPack' },
            { label: 'Tipo de Operación', key: 'tipoOperacion' },
            { label: 'Plazo', key: 'plazo' },
            { label: 'Plan', key: 'plan' },
            { label: 'Número de IMEI del Producto', key: 'productoNumeroIMEI' },
            { label: 'Descripción del Producto', key: 'productoDescripcion' },
            { label: 'Número de ICCID del Producto', key: 'productoNumeroICCID' },
            { label: 'Número de Celular', key: 'numeroCelular' },
            { label: 'Número de Referencia', key: 'numeroReferencia' },
            { label: 'Boleta/Factura', key: 'boletaFactura' },
            { label: 'Número de Serie de Boleta/Factura', key: 'numeroSerieBoletaFactura' },
            { label: 'Operador Cedente', key: 'operadorCedente' },
            { label: 'Modalidad de Portabilidad', key: 'modalidadPortabilidad' },
            { label: 'Monto de Renta Adelantada', key: 'montoRentaAdelantada' },
            { label: 'Monto de Pago Inicial', key: 'montoPagoInicial' },
            { label: 'Importe Cancelado', key: 'importeCancelado' },
            { label: 'Observaciones', key: 'observaciones' },
        ];

        // Mapear los datos para incluir solo las columnas seleccionadas
        const mappedData = csvData.map(item => {
            const vendedor = `${item.UserName} ${item.UserApPat} ${item.UserApMat}`;
            const clientes = `${item.ClienteNameOrRS} ${item.clienteApPaterno} ${item.clienteApMaterno}`;
            const mappedItem = {
                ALMACEN: item.almacenName,
                VENDEDOR: vendedor,
                FECHA: item.fechaVenta,
                TipoDOC: item.ClienteTipoDoc,
                DOC: item.ClienteNumDoc,
                SEC: item.numeroSec,
                CLIENTE: clientes,
                CHIP_PACK: item.chipPack,
                tipoOperacion: item.tipoOperacion,
                PLAZO: item.plazo,
                PLAN: item.plan,
                IMEI: item.productoNumeroIMEI,
                EQUIPO: item.productoDescripcion,
                ICCID: item.productoNumeroICCID,
                CELULAR: item.numeroCelular,
                REFERENCIA: item.numeroReferencia,
                DocSUNAT: item.boletaFactura,
                NumEMITIDO: item.numeroSerieBoletaFactura,
                OPERADOR: item.operadorCedente,
                MODALIDAD: item.modalidadPortabilidad,
                RENTA: item.montoRentaAdelantada,
                INICIAL: item.montoPagoInicial,
                CANCELADO: item.importeCancelado,
                OBSERVACION: item.observaciones,
            };
            return mappedItem;
        });

        const ws = XLSX.utils.json_to_sheet(mappedData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    return (
        <button className="text-sm bg-amber-500 sm:text-base hover:bg-green-600 text-white font-bold py-2 px-4 ml-2 rounded"
        onClick={(e) => exportToCSV(csvData,fileName)}>Export</button>
    )
}

export default BotonXlsx;

