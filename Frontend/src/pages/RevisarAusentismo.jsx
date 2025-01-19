import React, { useState, useEffect } from "react";
import { MdInfo } from "react-icons/md";
import Mensaje from '../components/Alerts/Message';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import LogoPrincipal from '../assets/logoQTGC.png';

const RevisarAusentismo = () => {
    const [ausentismo, setAusentismo] = useState({});
    const [registroMigratorio, setRegistroMigratorio] = useState([]);
    const [registrocuota, setRegistroCuota] = useState([]);
    const [registropatrimonial, setRegistroPatrimonial] = useState([]);
    const [mensaje, setMensaje] = useState({});
    const [busqueda, setBusqueda] = useState('');
    const [fechaSalida, setFechaSalida] = useState('');
    const [fechaEntrada, setFechaEntrada] = useState('');

    const consultarAusentismo = async (numeroMembresia) => {
        setAusentismo({});
        setMensaje({});
        if (numeroMembresia) {
            try {
                const token = localStorage.getItem('token');
                const url = `${import.meta.env.VITE_BACKEND_URL}/ausentismo/${numeroMembresia}`;
                const options = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                };
                const respuesta = await axios.get(url, options);
                setAusentismo(respuesta.data);
                console.log("ausentismo: ", respuesta.data)
                setMensaje({});
            } catch (error) {
                setMensaje({ respuesta: error.response.data.msg, tipo: false });
                setAusentismo({});
            }
        }
    };

    const handleInputChange = (e) => {
        setBusqueda(e.target.value);
    };

    const handleBuscar = () => {
        consultarAusentismo(busqueda);
        consultarRegistroMigratorio(busqueda);
        consultarRegistroCuotasPago(busqueda)
        consultaPatrimonial(busqueda)
             
    };

    
    const consultarRegistroMigratorio = async (numeroMembresia) => {
        setRegistroMigratorio([]);
        setMensaje({});
        if (numeroMembresia) {
            try {
                const token = localStorage.getItem('token');
                const url = `${import.meta.env.VITE_BACKEND_URL}/ausentismo/consultarRegistroMigratorio/${numeroMembresia}`;
                const options = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                };
                const respuesta = await axios.get(url, options);
                console.log("respuesta registro migratorio", respuesta);
                setRegistroMigratorio(respuesta.data.data || []); // Asegúrate de manejar el caso en que `data` no sea un array
                setMensaje({});
            } catch (error) {
                setMensaje({ respuesta: error.response.data.msg, tipo: false });
                setRegistroMigratorio([]);
            }
        }
    };

    const consultarRegistroCuotasPago = async (numeroMembresia) => {
        setRegistroCuota([]);
        setMensaje({});
        if (numeroMembresia) {
            try {
                const token = localStorage.getItem('token');
                const url = `${import.meta.env.VITE_BACKEND_URL}/ausentismo/consultarCuotaPagos/${numeroMembresia}`;
                const options = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                };
                const respuesta = await axios.get(url, options);
                console.log("respuesta registro cuota-pago", respuesta);
                setRegistroCuota(respuesta.data.data || []); // Asegúrate de manejar el caso en que `data` no sea un array
                setMensaje({});
            } catch (error) {
                setMensaje({ respuesta: error.response.data.msg, tipo: false });
                setRegistroCuota([]);
            }
        }
    };

    const consultaPatrimonial = async (numeroMembresia) => {
        setRegistroPatrimonial([]);
        setMensaje({});
        if (numeroMembresia) {
            try {
                const token = localStorage.getItem('token');
                const url = `${import.meta.env.VITE_BACKEND_URL}/ausentismo/consultarPatrimonial/${numeroMembresia}`;
                const options = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                };
                const respuesta = await axios.get(url, options);
                console.log("respuesta registro patrimonial", respuesta);
                setRegistroPatrimonial(respuesta.data.data || []); // Asegúrate de manejar el caso en que `data` no sea un array
                setMensaje({});
            } catch (error) {
                setMensaje({ respuesta: error.response.data.msg, tipo: false });
                setRegistroPatrimonial([]);
            }
        }
    };

    // Función para generar el PDF
    const generarPDF = () => {
        const doc = new jsPDF();
        
        // Logo
        doc.addImage(LogoPrincipal, 'PNG', 10, 5, 20, 20);
        
        // Título principal
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text('ARAST', 105, 15, { align: 'center' });
        doc.setFontSize(12);
        doc.text('Liquidación de Ausentismo', 105, 22, { align: 'center' });

        // Información general
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 150, 10);
        doc.text('Liquidada desde Septiembre 2023', 10, 30);
        doc.text(`Fecha Reactivación: `, 10, 40);
        doc.text(`Observación: `, 10, 50);

        // Datos del socio
        if (ausentismo.data) {
            doc.text(`Membresía: ${busqueda}`, 10, 60);
            doc.text(`Socio: ${ausentismo.data.Socio}`, 10, 70);
            doc.text(`Categoría: ${ausentismo.data.Categoria}`, 10, 80);
            doc.text(`Estado: ${ausentismo.data.Estado}`, 10, 90);
            
            // Datos adicionales (columna derecha)
            doc.text(`Fecha de Nacimiento: ${ausentismo.data.FechaNacimiento}`, 100, 60);
            doc.text(`Edad: ${ausentismo.data.Edad}`, 100, 70);
            doc.text(`Estado Anterior: ${ausentismo.data.EstadoAnterior}`, 100, 80);
        }

        doc.line(10, 105, 200, 105);

        // Tabla de cuotas
        if (registrocuota.length > 0) {
            doc.autoTable({
                startY: 120,
                head: [['Períodos', 'Días fuera del país', 'Dias dentro del país', 'Total a pagar']],
                body: registrocuota.map(row => [
                    row.periodo, 
                    row.diasFueraPais, 
                    row.diasDentroPais, 
                    row.totalPagar.toFixed(2)
                ]),
                headStyles: {
                    fillColor: [255, 255, 0],
                    textColor: [0, 0, 0]
                },
                styles: {
                    halign: 'center',
                    cellPadding: 5,
                }
            });
        }

        // Tabla de patrimonial
        const cuotaPos = doc.autoTable.previous.finalY || 140;
        doc.setFont("helvetica", "bold");
        doc.text('Patrimonial:', 10, cuotaPos + 10);
        doc.setFont("helvetica", "normal");

        if (registropatrimonial.length > 0) {
            doc.autoTable({
                startY: cuotaPos + 20,
                head: [['Períodos', 'Días fuera del país', 'Dias dentro del país', 'Total a pagar']],
                body: registropatrimonial.map(row => [
                    row.periodo, 
                    row.diasFueraPais, 
                    row.diasDentroPais, 
                    row.totalPagar.toFixed(2)
                ]),
                headStyles: {
                    fillColor: [255, 255, 0],
                    textColor: [0, 0, 0]
                },
                styles: {
                    halign: 'center',
                    cellPadding: 5,
                }
            });
        }

        // Totales
        const finalY = doc.autoTable.previous.finalY || 220;
        doc.setFont("helvetica", "bold");
        const totalFinal = (
            registrocuota.reduce((acc, row) => acc + row.totalPagar, 0) + 
            registropatrimonial.reduce((acc, row) => acc + row.totalPagar, 0)
        ).toFixed(2);
        doc.text(`Total Final: ${totalFinal}`, 140, finalY + 20);

        doc.save(`reporte_ausentismo_${busqueda}.pdf`);
    };

    const handleNuevaBusqueda = () => {
        setBusqueda(''); 
        setAusentismo({}); 
        setMensaje({}); 
    };


    return (
        <>
            <div className="container mx-auto px-4">
                <h1 className='font-black text-2xl sm:text-4xl text-gray-500'>Revisar Ausentismo</h1>
                <hr className='my-4' />
                <p className='mb-8 text-sm sm:text-base'>Este módulo te permite visualizar ausentismos.</p>

                <div className="flex flex-col sm:flex-row justify-center mb-8 items-center gap-4">
                    <h1 className='text-gray-700 uppercase font-bold text-sm'>Número de membresía: </h1>
                    <input
                        type="text"
                        placeholder="Ingrese el número de membresía"
                        value={busqueda}
                        onChange={handleInputChange}
                        className="border border-gray-400 rounded p-3 w-full sm:w-72 shadow-sm"
                    />
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
                Object.keys(ausentismo).length !== 0 &&
                (
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-100 p-6 rounded-lg shadow-md mb-10">
                        <div>
                            <p className="text-md text-gray-00 mt-4">
                                <span className="text-gray-600 uppercase font-bold">Socio:</span>
                                {ausentismo.data.Socio}
                            </p>
                            <p className="text-md text-gray-00 mt-4">
                                <span className="text-gray-600 uppercase font-bold">Titular:</span>
                                {ausentismo.data.Titular}
                            </p>
                        </div>
                        <div>
                            <p className="text-md text-gray-00 mt-4">
                                <span className="text-gray-600 uppercase font-bold">Categoría:</span>
                                {ausentismo.data.Categoria}
                            </p>
                            <p className="text-md text-gray-00 mt-4">
                                <span className="text-gray-600 uppercase font-bold">Fecha Nacimiento:</span>
                                {ausentismo.data.FechaNacimiento}
                            </p>
                        </div>
                        <div>
                            <p className="text-md text-gray-00 mt-4">
                                <span className="text-gray-600 uppercase font-bold">Estado:</span>
                                {ausentismo.data.Estatus}
                            </p>
                            <p className="text-md text-gray-00 mt-4">
                                <span className="text-gray-600 uppercase font-bold">Edad:</span>
                                {ausentismo.data.Edad}
                            </p>
                        </div>
                        <div>
                            <p className="text-md text-gray-00 mt-4">
                                <span className="text-gray-600 uppercase font-bold">Fecha de Ausentismo:</span>
                                {ausentismo.data.FechaAusentismo}
                            </p>
                        </div>
                    </div>
                )
                    
            }

            {ausentismo.data && ausentismo.data.FechaAusentismo && (
                <>
                  
                    <div className="flex flex-col sm:flex-row items-center justify-center mb-6 gap-4">
                        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2">
                            <label
                                htmlFor='Salida:'
                                className='text-gray-700 uppercase font-bold text-sm'>Liquida desde: </label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded p-3 w-full sm:w-auto shadow-sm"
                                placeholder="Fecha de Salida"
                                value={fechaSalida}
                                onChange={(e) => setFechaSalida(e.target.value)}
                            />
                        </div>
                        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2">
                            <label
                                htmlFor='Entrada:'
                                className='text-gray-700 uppercase font-bold text-sm'>Comentario: </label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded p-3 w-full sm:w-auto shadow-sm"
                                placeholder="Ingresa un comentario"
                                value={fechaEntrada}
                                onChange={(e) => setFechaEntrada(e.target.value)}
                            />
                        </div>
                    </div>

                    {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}

                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                         <div className="text-center mb-10">
                             <h1 className="text-2xl text-left font-bold text-customBlue">Movimientos migratorios</h1>
                        </div>
                        <div className="overflow-x-auto shadow-md rounded-lg mb-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-customYellow text-slate-400">
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2">Fecha Salida</th>
                                        <th className="border border-gray-300 px-4 py-2">Fecha Entrada</th>
                                        <th className="border border-gray-300 px-4 py-2">Días en Exterior</th>
                                        <th className="border border-gray-300 px-4 py-2">Días en el País</th>
                                        <th className="border border-gray-300 px-4 py-2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registroMigratorio.length > 0 ? (
                                        <>
                                        {registroMigratorio.map((row, index) => (
                                        <tr key={index} className="odd:bg-gray-100 even:bg-gray-50">
                                            <td className="border border-gray-300 px-4 py-2 text-center">{row.fechaSalida}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">{row.fechaEntreda}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">{row.exterior}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">{row.pais}</td>
                                            
                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                <MdInfo className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2" />
                                            </td>
                                        </tr>
                                        ))}
                                       </>
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4">No hay registros</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-1 text-center mb-10">
                             <h1 className="text-2xl text-left font-bold text-customBlue">Cuotas</h1>
                        </div>
                        <div className="overflow-x-auto shadow-md rounded-lg mb-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-customYellow text-slate-400">
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2">Períodos</th>
                                        <th className="border border-gray-300 px-4 py-2">Días fuera del país</th>
                                        <th className="border border-gray-300 px-4 py-2">Días dentro del país</th>
                                        <th className="border border-gray-300 px-4 py-2">Total a pagar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {registrocuota.length > 0 ? (
                                        <>
                                        {registrocuota.map((row, index) => (
                                        <tr key={index} className="odd:bg-gray-100 even:bg-gray-50">
                                            <td className="border border-gray-300 px-4 py-2 text-center">{row.periodo}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">{row.diasFueraPais}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">{row.diasDentroPais}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">{row.totalPagar}</td>
                                        </tr>
                                         ))}
                                        <tr className="font-bold bg-gray-200">
                                            <td colSpan="3"     className="border border-gray-300 px-4 py-2 text-center">Total</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">{registrocuota.reduce((acc, row) => acc + row.totalPagar, 0)}</td>
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

                        <div className="text-center mt-1 mb-10">
                             <h1 className="text-2xl text-left font-bold text-customBlue">Patrimonial</h1>
                        </div>

                        <div className="overflow-x-auto shadow-md rounded-lg mb-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-customYellow text-slate-400">
                                    <tr>
                                    <th className="border border-gray-300 px-4 py-2">Períodos</th>
                                        <th className="border border-gray-300 px-4 py-2">Días fuera del país</th>
                                        <th className="border border-gray-300 px-4 py-2">Días dentro del país</th>
                                        <th className="border border-gray-300 px-4 py-2">Total a pagar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {registropatrimonial.length > 0 ? (
                                        <>
                                        {registropatrimonial.map((row, index) => (
                                        <tr key={index} className="odd:bg-gray-100 even:bg-gray-50">
                                            <td className="border border-gray-300 px-4 py-2 text-center">{row.periodo}</td>
                                        <   td className="border border-gray-300 px-4 py-2 text-center">{row.diasFueraPais}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">{row.diasDentroPais}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">{row.totalPagar}</td>
                                        </tr>
                                            ))}
                                            <tr className="font-bold bg-gray-200">
                                                <td colSpan="3" className="border border-gray-300 px-4 py-2 text-center">Total</td>
                                                <td className="border border-gray-300 px-4 py-2 text-center">{registropatrimonial.reduce((acc, row) => acc + row.totalPagar, 0)}</td>
                                            </tr>
                                        </>
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4">No hay registros</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                       
                    </div>

                    <div className="font-bold bg-gray-200 mt-6 text-lg text-center mx-auto p-4 w-full sm:w-1/2 rounded-lg shadow-lg">
                        <p>TOTAL A PAGAR: {(registrocuota.reduce((acc, row) => acc + row.totalPagar, 0) + registropatrimonial.reduce((acc, row) => acc + row.totalPagar, 0)).toFixed(2)}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                        <button className="bg-customBlue hover:bg-green-600 text-white px-6 py-3 rounded shadow-lg w-full sm:w-auto">
                            Confirmar
                        </button>
                        <button 
                            className="bg-customBlue hover:bg-green-600 text-white px-6 py-3 rounded shadow-lg w-full sm:w-auto"
                            onClick={generarPDF}
                        >
                            Imprimir Reporte
                        </button>
                    </div>
                </>
            )}
        </>
    );
};

export default RevisarAusentismo;
