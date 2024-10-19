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
        setRegistros([])
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
        doc.addImage(base64Image, 'PNG', 10, 5, 20, 20); 
        // Título principal
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text('ARAST', 105, 15, { align: 'center' });
        doc.setFontSize(12);
        doc.text('Reingreso', 105, 22, { align: 'center' });
        doc.line(10, 55, 200, 55);
        // Sección de información del socio
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 150, 10);
        doc.text(`Liquidada desde: ${fechaFormateada}`, 10, 40);
        doc.text(`Observación: ${observacion} `, 10, 50);
       
        // Datos del socio
        if (Object.keys(reingreso).length !== 0) {
            doc.text(`Membresía: ${busqueda}`, 10, 60);
            doc.text(`Socio: ${reingreso.Socio}`, 10, 70);
            doc.text(`Categoría: ${reingreso.Categoria}`, 10, 80);
            doc.text(`Fecha final liquidación: ${reingreso.FechaFinalLiquidacion}`, 10, 90);
            doc.text(`Estado: ${reingreso.Estatus}`, 10, 100);
        }

        // Datos adicionales del socio
        doc.text(`Fecha de Nacimiento: ${reingreso.FechaNacimiento}`, 100, 60);
        doc.text(`Estado Anterior: ${form.estadoAnterior}`, 100, 80);

        doc.line(10, 105, 200, 105);


        if (registros.length > 0) {
            doc.autoTable({
                startY: 120,
                head: [['Año','Categoria','Total Patrimonial Anual', 'Total Predial Anual', 'Total Cuota Anual', 'Total Anual']],
                body: registros.map(row => [
                    row.anio, row.categoriasAnuales, row.totalPatrimonialAnual.toFixed(2), row.totalPredialAnual.toFixed(2), row.totalCuotaAnual, row.totalAnual.toFixed(2)
                ]),
                headStyles: {
                    fillColor: [255, 255, 0],
                    textColor: [0, 0, 0]
                },  // Cambia el color de fondo del encabezado a amarillo
                styles: {
                    halign: 'center', // Centrar texto en la tabla
                    cellPadding: 5,
                }
            });
        }




        // Sección de Valor de Reajuste y total
        const patrimonialPos = doc.autoTable.previous.finalY || 210;
        doc.setFont("helvetica", "bold")
        doc.text(`Total Final: ${(registrosData.totalFinal).toFixed(2)}`, 158, patrimonialPos + 20);
        doc.text(`Total Amnistía: ${(registrosData.amnistia).toFixed(2)}`, 95, patrimonialPos + 30);

        // Descargar el PDF
        doc.save(`reporte_reingreso_${busqueda}.pdf`);
    };

    return (
        <>
            <div>
                <h1 className='font-black text-4xl text-gray-500'>Reingreso</h1>
                <hr className='my-4' />
                <p className='mb-8'>Este módulo te permite hacer el calculo del reingreso</p>
            </div>
            <div className="container mx-auto p-6">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-customBlue">Registros por período</h1>
                </div>

                <div className="flex justify-center mb-8 items-center ">
                    <h1 className='text-gray-700 item uppercase mr-2 font-bold text-sm'>Número de membresía: </h1>
                    <input
                        type="text"
                        placeholder="Ingrese el número de membresía"
                        value={busqueda}
                        onChange={handleInputChange}
                        className="border-2 border-gray-400 mr-2 rounded p-2 w-72 shadow-sm"
                    />

                    <div className="">
                        <input
                            type="date"
                            className='border-2 w-40 p-2 mt-1 mr-2 placeholder-gray-400 rounded-md'
                            placeholder="Ingrese fecha inicio de cobro YYYY-MM-DD"
                            name='fechaInicioCobroInput'
                            value={form.fechaInicioCobroInput}
                            onChange={handleChange}

                        />
                    </div>

                    <div className=" px-2">
                        <select
                            id='tipoCobro'
                            className='border-2 w-60  p-2 mt-1 placeholder-gray-400 rounded-md mr-2'
                            name='tipoCobro'
                            value={form.tipoCobro}
                            onChange={handleChange}
                        >
                            <option value='' disabled>
                                Seleccione el tipo de cobro
                            </option>
                            <option value='Juvenil'>Juvenil</option>
                            <option value='Retirado'>Retirado</option>
                        </select>
                    </div>

                    <button
                        className="bg-customBlue hover:bg-blue-900 mr-2 text-white px-6 py-2 rounded shadow"
                        onClick={handleBuscar}>
                        Buscar
                    </button>
                    <button className="bg-customBlue mr hover:bg-blue-900 text-white px-6 py-2 rounded shadow"
                        onClick={handleNuevaBusqueda}>
                        Nueva Búsqueda
                    </button>
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
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full border-collapse">
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
                                            <td colSpan="5" className="border border-gray-300 px-4 py-2 text-center">Total Final</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">

                                                {(registrosData.totalFinal).toFixed(2)}
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
                    <div className="font-bold bg-gray-200 mt-6 text-lg text-center mx-auto p-4 w-1/2 rounded-lg shadow-lg">
                        <p>TOTAL AMNISTÍA: {(registrosData.amnistia).toFixed(2)}</p>
                    </div>

                    <div className="text-center mt-6 ">
                        <button className="bg-customBlue hover:bg-green-600 text-white px-6 py-3 rounded shadow-lg">
                            Confirmar
                        </button>

                        <button className="bg-customBlue ml-4 hover:bg-green-600 text-white px-6 py-3 rounded shadow-lg" onClick={generarPDF}
                        >
                            Imprimir Reporte
                        </button>
                    </div>
                </>
            )}
        </>

    )
}

export default Reactivacion