import React, { useState } from "react";
import Mensaje from '../components/Alerts/Message';
import axios from 'axios';

const Suspension = () => {

    const [suspension, setSuspension] = useState({});
    const [pagoSuspension, setPagoSuspension] = useState({});
    const [mensaje, setMensaje] = useState({});
    const [busqueda, setBusqueda] = useState('');
    
    const consultarSuspension = async (numeroMembresia) => {
        setSuspension({});
        setMensaje({});
        if (numeroMembresia) {
            try {
                const token = localStorage.getItem('token');
                const url = `${import.meta.env.VITE_BACKEND_URL}/suspension/${numeroMembresia}`;
                const options = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                };
                const respuesta = await axios.get(url, options);
                setSuspension(respuesta.data);
                if (respuesta.data) {
                    consultarPagoSuspension(numeroMembresia);
                }
                setMensaje({});
            } catch (error) {
                console.log(error)
                setMensaje({ respuesta: error.response.data.msg, tipo: false });
                setSuspension({});
            }
        }
    };

    const consultarPagoSuspension = async (numeroMembresia) => {
        setPagoSuspension({});
        setMensaje({});
        if (numeroMembresia) {
            try {
                const token = localStorage.getItem('token');
                const url = `${import.meta.env.VITE_BACKEND_URL}/suspension/pago/${numeroMembresia}`;
                const options = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                };
                const respuesta = await axios.get(url, options);
                setPagoSuspension(respuesta.data.data);
                console.log("url:", url)
                console.log("Pago Suspension: ",respuesta.data.data)
                setMensaje({});
            } catch (error) {
                setMensaje({ respuesta: error.response.data.msg, tipo: false });
                setPagoSuspension({});
            }
        }
    };

    const handleInputChange = (e) => {
        setBusqueda(e.target.value);
    };

    const handleBuscar =  () => {

        consultarSuspension(busqueda);
          
    };

    const handleNuevaBusqueda = () => {
        setBusqueda(''); 
        setSuspension({}); 
        setPagoSuspension({}); 
        setMensaje({}); 
    };
    return (
        <>
            <div>
                <h1 className='font-black text-4xl text-gray-500'>Registro de Suspensión Temporal</h1>
                <hr className='my-4' />
                <p className='mb-8'>Este módulo te permite registrar la suspensión temporal</p>
            </div>
            <div className="container mx-auto p-6">
                
                <div className="flex justify-center mb-4 items-center">
                    <h1 className='text-gray-700 item uppercase mr-2 font-bold text-sm'>Número de membresía: </h1>
                    <input
                        type="text"
                        placeholder="Ingrese el número de membresía"
                        value={busqueda}
                        onChange={handleInputChange}
                        className="border border-gray-400 rounded p-3 w-72 mr-2 shadow-sm"
                    />
                    <button className="bg-customBlue mr-2 hover:bg-blue-900 text-white px-6 py-2 rounded shadow"
                         onClick={handleBuscar}>
                        Buscar
                    </button>
                    <button className="bg-customBlue hover:bg-blue-900 text-white px-6 py-2 rounded shadow"
                         onClick={handleNuevaBusqueda}>
                        Nueva Búsqueda
                    </button>
                </div>
            </div>

            {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}

            {
                Object.keys(suspension).length !== 0 &&
                (
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-100 p-6 rounded-lg shadow-md mb-10">
                        <div>
                            <p className="text-md text-gray-00 mt-4">
                                <span className="text-gray-600 uppercase font-bold">Socio:</span>
                                {suspension.data.Socio}
                            </p>
                            <p className="text-md text-gray-00 mt-4">
                                <span className="text-gray-600 uppercase font-bold">Titular:</span>
                                {suspension.data.Titular}
                            </p>
                        </div>
                        <div>
                            <p className="text-md text-gray-00 mt-4">
                                <span className="text-gray-600 uppercase font-bold">Categoría:</span>
                                {suspension.data.Categoria}
                            </p>
                            <p className="text-md text-gray-00 mt-4">
                                <span className="text-gray-600 uppercase font-bold">Fecha Nacimiento:</span>
                                {suspension.data.FechaNacimiento}
                            </p>
                        </div>
                        <div>
                            <p className="text-md text-gray-00 mt-4">
                                <span className="text-gray-600 uppercase font-bold">Estado:</span>
                                {suspension.data.Estatus}
                            </p>
                            <p className="text-md text-gray-00 mt-4">
                                <span className="text-gray-600 uppercase font-bold">Edad:</span>
                                {suspension.data.Edad}
                            </p>
                        </div>
                        <div>
                            <p className="text-md text-gray-00 mt-4">
                                <span className="text-gray-600 uppercase font-bold">Fecha de suspension:</span>
                                {suspension.data.FechaSuspension}
                            </p>
                        </div>
                    </div>
                )     
            }

            {pagoSuspension.length >0 && suspension.data && (
                <>
                    <div className="flex items-center justify-center mb-6">
                    <label
                        htmlFor='Entrada:'
                        className='text-gray-700 mr-2 uppercase font-bold text-sm'>Observación: </label>
                        <input
                            type="text"
                            className="border border-gray-300 rounded p-3 mr-2 shadow-sm"
                            placeholder="Ingresa una observación"
                        />
                    </div>
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full border-collapse">
                            <thead className="bg-customYellow text-slate-400">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Mes/Año</th>
                                    <th className="border border-gray-300 px-4 py-2">Cuota Mensual</th>
                                    <th className="border border-gray-300 px-4 py-2">Tipo</th>
                                </tr>
                            </thead>
                            <tbody>
                            {pagoSuspension.length > 0 ? (
                                <>
                                    {pagoSuspension.map((row, index) => {
                                        // Seleccionar el valor que no sea null
                                        const cuotaMensual = row.ValorPredial !== null ? row.ValorPredial : row.ValorPatrimonial;
                                        // Determinar el tipo basado en qué valor se tomó
                                        const tipo = row.ValorPredial !== null ? "Predial" : "Patrimonial";

                                        return (
                                            <tr key={index} className="odd:bg-gray-100 even:bg-gray-50">
                                                <td className="border border-gray-300 px-4 py-2 text-center">{row.Mes + "/" + row.Anio}</td>
                                                <td className="border border-gray-300 px-4 py-2 text-center">{cuotaMensual}</td>
                                                <td className="border border-gray-300 px-4 py-2 text-center">{tipo}</td>
                                            </tr>
                                        );
                                    })}

                                    {/* Fila de total */}
                                    <tr className="font-bold bg-gray-200">
                                        <td className="border border-gray-300 px-4 py-2 text-center">Total</td>
                                        <td colSpan="2" className="border border-gray-300 px-4 py-2 text-center">
                                            {
                                                // Calcular el total sumando los valores que no son null
                                                pagoSuspension.reduce((acc, row) => {
                                                    return acc + (row.ValorPredial !== null ? row.ValorPredial : row.ValorPatrimonial);
                                                }, 0)
                                            }
                                        </td>
                                    </tr>
                                </>
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center py-4">No hay registros</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                    <div className="text-center mt-6 ">
                        <button className="bg-customBlue hover:bg-green-600 text-white px-6 py-3 rounded shadow-lg">
                            Confirmar
                        </button>

                        <button className="bg-customBlue ml-4 hover:bg-green-600 text-white px-6 py-3 rounded shadow-lg"  
                        >
                            Imprimir Reporte
                        </button>
                    </div>
                </>
            )}
        </>
    )
}

export default Suspension