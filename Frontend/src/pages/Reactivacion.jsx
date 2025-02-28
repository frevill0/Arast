import React, { useState } from "react";
import Mensaje from '../components/Alerts/Message';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import LogoPrincipal from '../assets/LogoQTGC.png'

const Reactivacion = () => {

    const [reingreso, setReingreso] = useState({});
    const [mensaje, setMensaje] = useState({});
    const [busqueda, setBusqueda] = useState('');
    const [registros, setRegistros] = useState([]);
    const [registrosData, setRegistrosData] = useState({});
    const [mensajeRegistro, setMensajeRegistro] = useState({});
    const [form, setform] = useState({
        estadoAnterior: "",
        fechaInicioCobroInput: "",
        tipoCobro: ""
    })
    const [observacion, setObservacion] = useState('');

    // Función para formatear la fecha a dd/mm/yyyy
    const formatearFecha = (fecha) => {
        const [año, mes, dia] = fecha.split('-');
        return `${dia}/${mes}/${año}`; 
    };

    // Función para obtener el valor formateado de la fecha
    const obtenerFechaFormateada = () => {
        return form.fechaInicioCobroInput ? formatearFecha(form.fechaInicioCobroInput) : '';
    };

    const consultarReingreso = async (numeroMembresia) => {
        setReingreso({});
        setMensaje({});
        if (numeroMembresia) {
            try {
                const token = localStorage.getItem('token');
                const url = `${import.meta.env.VITE_BACKEND_URL}/reingreso/${numeroMembresia}`;
                const options = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                };
                const respuesta = await axios.get(url, options);
                setReingreso(respuesta.data.data);

                setMensaje({});
            } catch (error) {
                setMensaje({ respuesta: error.response.data.msg, tipo: false });
                setReingreso({});
            }
        }
    };

    const handleChange = (e) => {
        setform({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    const consultarRegistros = async (numeroMembresia) => {
        setRegistros([]);
        setMensajeRegistro({});
        if (numeroMembresia) {
            try {
                const token = localStorage.getItem('token');
                const url = `${import.meta.env.VITE_BACKEND_URL}/reingreso/pago/${numeroMembresia}`;
                const options = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                };
                const respuesta = await axios.post(url,form, options);
                setRegistros(respuesta.data.anios); 
                setRegistrosData(respuesta.data)
                setMensajeRegistro({});
            } catch (error) {
                setMensajeRegistro({ respuesta: error.response.data.message, tipo: false });
                setRegistros([]);
            }
        }
    };

    const handleInputChange = (e) => {
        setBusqueda(e.target.value);
    };

    const handleBuscar = () => {
        consultarReingreso(busqueda);
        consultarRegistros(busqueda);

    };

    const handleNuevaBusqueda = () => {
        setBusqueda('');
        setReingreso({});
        setRegistros([]);
        setObservacion("");
        setMensaje({});
        setform({
            fechaInicioCobroInput: "",
            tipoCobro: ""
        });
    };

    // Función para manejar el cambio en el input
    const handleObservacionChange = (event) => {
        setObservacion(event.target.value);
    };

    const convertImageToBase64 = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.error('Error al cargar la imagen: ' + response.statusText);
                return null;  
            }
    
            // Verificar el tipo de archivo
            const contentType = response.headers.get("Content-Type");
            if (!contentType.startsWith("image/")) {
                console.error('El archivo no es una imagen. Tipo de archivo: ' + contentType);
                return null;  
            }
    
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
    
                reader.onloadend = () => {
                    resolve(reader.result);  // Devuelve la cadena Base64 completa
                };
                reader.onerror = (error) => {
                    console.error('Error al convertir a base64: ' + error);
                    reject(error);  
                };
    
                reader.readAsDataURL(blob);  // Inicia la conversión a Base64
            });
        } catch (error) {
            console.error('Error durante la conversión:', error);
            return null;
        }
      };

    // Función para generar el PDF
    const generarPDF = async () => {
        const doc = new jsPDF();
        const fechaFormateada = obtenerFechaFormateada();
        const base64Image = await convertImageToBase64(LogoPrincipal)
        
        // Logo y encabezado
        doc.addImage(base64Image, 'PNG', 10, 5, 20, 20); 
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text('ARAST', 105, 15, { align: 'center' });
        doc.setFontSize(12);
        doc.text('Reingreso', 105, 22, { align: 'center' });
        
        // Información general
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 150, 10);
        doc.text(`Observación: ${observacion}`, 10, 30);
        
        // Datos del socio
        if (Object.keys(reingreso).length !== 0) {
            doc.text(`Membresía: ${busqueda}`, 10, 40);
            doc.text(`Socio: ${reingreso.Socio}`, 10, 45);
            doc.text(`Categoría: ${reingreso.Categoria}`, 10, 50);
            doc.text(`Fecha final liquidación: ${reingreso.FechaFinalLiquidacion}`, 10, 55);
            doc.text(`Estado: ${reingreso.Estatus}`, 10, 60);
            
            // Datos adicionales (columna derecha)
            doc.text(`Fecha de Nacimiento: ${reingreso.FechaNacimiento}`, 100, 40);
            doc.text(`Estado Anterior: ${form.estadoAnterior}`, 100, 45);
        }

        doc.line(10, 65, 200, 65);

        // Tabla de registros
        if (registros.length > 0) {
            doc.autoTable({
                startY: 70,
                head: [['Año','Categoria','Total Patrimonial Anual', 'Total Predial Anual', 'Total Cuota Anual', 'Total Anual']],
                body: registros.map(row => [
                    row.anio, 
                    row.categoriasAnuales, 
                    row.totalPatrimonialAnual.toFixed(2), 
                    row.totalPredialAnual.toFixed(2), 
                    row.totalCuotaAnual, 
                    row.totalAnual.toFixed(2)
                ]),
                headStyles: {
                    fillColor: [255, 255, 0],
                    textColor: [0, 0, 0]
                },
                styles: {
                    halign: 'center',
                    cellPadding: 3,
                    fontSize: 8
                }
            });
        }

        // Totales
        const finalY = doc.autoTable.previous.finalY + 5;
        doc.setFont("helvetica", "bold");
        doc.text(`Total Anual Final: ${(registrosData.total).toFixed(2)}`, 140, finalY);
        doc.text(`Total Descuento: ${(registrosData.amnistia).toFixed(2)}`, 140, finalY + 5);
        doc.text(`Total Recategorización: ${(registrosData.recategorizacion).toFixed(2)}`, 140, finalY + 10);
        doc.text(`Total Final: ${(registrosData.totalFinal).toFixed(2)}`, 90, finalY + 20);

        doc.save(`reporte_reingreso_${busqueda}.pdf`);
    };

    return (
        <>
            <div className="container mx-auto px-4">
                <h1 className='font-black text-2xl sm:text-4xl text-gray-500'>Reingreso</h1>
                <hr className='my-4' />
                <p className='mb-8 text-sm sm:text-base'>Este módulo te permite hacer el calculo del reingreso de los socios</p>

                <div className="flex flex-col sm:flex-row justify-center mb-8 items-center gap-4">
                    <h1 className='text-gray-700 uppercase font-bold text-sm'>Número de membresía: </h1>
                    <input
                        type="text"
                        placeholder="Ingrese el número de membresía"
                        value={busqueda}
                        onChange={handleInputChange}
                        className="border-2 border-gray-400 rounded p-2 w-full sm:w-72 shadow-sm"
                    />
                    <div className="w-full sm:w-auto">
                        <input
                            type="date"
                            className='border-2 w-full sm:w-40 p-2 mt-1 placeholder-gray-400 rounded-md'
                            placeholder="Ingrese fecha inicio de cobro YYYY-MM-DD"
                            name='fechaInicioCobroInput'
                            value={form.fechaInicioCobroInput}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="w-full sm:w-auto">
                        <select
                            id='tipoCobro'
                            className='border-2 w-full sm:w-60 p-2 mt-1 placeholder-gray-400 rounded-md'
                            name='tipoCobro'
                            value={form.tipoCobro}
                            onChange={handleChange}
                        >
                            <option value='' disabled>Seleccione el tipo de cobro</option>
                            <option value='Juvenil'>Juvenil</option>
                            <option value='Retirado'>Retirado</option>
                        </select>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button 
                            className="bg-customBlue hover:bg-blue-900 text-white px-4 py-2 rounded shadow flex-1 sm:flex-none"
                            onClick={handleBuscar}
                        >
                            Buscar
                        </button>
                        <button 
                            className="bg-customBlue hover:bg-blue-900 text-white px-4 py-2 rounded shadow flex-1 sm:flex-none"
                            onClick={handleNuevaBusqueda}
                        >
                            Nueva Búsqueda
                        </button>
                    </div>
                </div>
            </div>

            {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}

            {
                Object.keys(reingreso).length !== 0 &&
                (

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-100 p-6 rounded-lg shadow-md mb-10">
                        <div>
                            <p className="text-md text-gray-00 mt-4">
                                <span className="text-gray-600 uppercase font-bold">Socio:</span>
                                {reingreso.Socio}
                            </p>
                            <p className="text-md text-gray-00 mt-4">
                                <span className="text-gray-600 uppercase font-bold">Titular:</span>
                                {reingreso.Titular}
                            </p>
                        </div>
                        <div>
                            <p className="text-md text-gray-00 mt-4">
                                <span className="text-gray-600 uppercase font-bold">Categoría:</span>
                                {reingreso.Categoria}
                            </p>
                            <p className="text-md text-gray-00 mt-4">
                                <span className="text-gray-600 uppercase font-bold">Fecha Nacimiento:</span>
                                {reingreso.FechaNacimiento}
                            </p>
                        </div>
                        <div>
                            <p className="text-md text-gray-00 mt-4">
                                <span className="text-gray-600 uppercase font-bold">Fecha de liquidación:</span>
                                {reingreso.FechaFinalLiquidacion}
                            </p>
                        </div>

                        <div className='flex items-center mb-3'>
                            <label
                                htmlFor='estadoAnterior'
                                className='text-gray-700 uppercase font-bold mr-2'>
                                Estado Anterior:
                            </label>
                            <input
                                id='estadoAnterior'
                                type='text'
                                className='border-2 p-1 placeholder-gray-400 rounded-md w-1/2'
                                placeholder='Ingrese estado anterior'
                                name='estadoAnterior'
                                value={form.estadoAnterior}
                                onChange={handleChange}
                            />
                        </div>

                    </div>
                )
            }

            {Object.keys(mensajeRegistro).length > 0 && <Mensaje tipo={mensajeRegistro.tipo}>{mensajeRegistro.respuesta}</Mensaje>}

            {registros.length > 0 && (
                <>
                    <div className="flex items-center justify-center mb-6">
                        <label
                            htmlFor='Entrada:'
                            className='text-gray-700 mr-2 uppercase font-bold text-sm'>Observación: </label>
                        <input
                            type="text"
                            className="border border-gray-300 rounded p-3 mr-2 shadow-sm"
                            placeholder="Ingresa una observación"
                            name="observacion"
                            value={observacion} 
                            onChange={handleObservacionChange}  
                        />
                    </div>
                    <div className="overflow-x-auto shadow-md rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-customYellow text-slate-400">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Año</th>
                                    <th className="border border-gray-300 px-4 py-2">Categoría</th>
                                    <th className="border border-gray-300 px-4 py-2">Anual Cuotas </th>
                                    <th className="border border-gray-300 px-4 py-2">Anual Patrimonial</th>
                                    <th className="border border-gray-300 px-4 py-2">Anual Predial</th>
                                    <th className="border border-gray-300 px-4 py-2">Total Anual</th>
                                </tr>

                            </thead>
                            <tbody>
                                {registros.length > 0 ? (
                                    <>
                                        {registros.map((row, index) => (
                                            <tr key={index} className="odd:bg-gray-100 even:bg-gray-50">
                                                <td className="border border-gray-300 px-4 py-2 text-center">{row.anio}</td>
                                                <td className="border border-gray-300 px-4 py-2 text-center">{row.categoriasAnuales}</td>
                                                <td className="border border-gray-300 px-4 py-2 text-center">{row.totalCuotaAnual.toFixed(1)}</td>
                                                <td className="border border-gray-300 px-4 py-2 text-center">{row.totalPatrimonialAnual.toFixed(1)}</td>
                                                <td className="border border-gray-300 px-4 py-2 text-center">{row.totalPredialAnual.toFixed(1)}</td>
                                                <td className="border border-gray-300 px-4 py-2 text-center">{row.totalAnual.toFixed(1)}</td>
                                            </tr>
                                        ))}
                                        <tr className="font-bold bg-gray-200">
                                            <td colSpan="5" className="border border-gray-300 px-4 py-2 text-center">Total</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">

                                                {(registrosData.total).toFixed(2)}
                                            </td>
                                        </tr>
                                    </>
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4">No hay registros</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                        <div className="font-bold bg-gray-200 p-4 rounded-lg shadow-lg text-center">
                            <p className="text-sm sm:text-lg">TOTAL DESCUENTO: {(registrosData.amnistia).toFixed(2)}</p>
                        </div>
                        <div className="font-bold bg-gray-200 p-4 rounded-lg shadow-lg text-center">
                            <p className="text-sm sm:text-lg">TOTAL RECATEGORIZACIÓN: {(registrosData.recategorizacion).toFixed(2)}</p>
                        </div>
                        <div className="font-bold bg-gray-200 p-4 rounded-lg shadow-lg text-center">
                            <p className="text-sm sm:text-lg">TOTAL FINAL: {(registrosData.totalFinal).toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                        <button className="bg-customBlue hover:bg-green-600 text-white px-6 py-3 rounded shadow-lg w-full sm:w-auto">
                            Confirmar
                        </button>
                        <button className="bg-customBlue hover:bg-green-600 text-white px-6 py-3 rounded shadow-lg w-full sm:w-auto" onClick={generarPDF}>
                            Imprimir Reporte
                        </button>
                    </div>
                </>
            )}
        </>

    )
}

export default Reactivacion