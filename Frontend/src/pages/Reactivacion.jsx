import React, { useState } from "react";
import Mensaje from '../components/Alerts/Message';
import axios from 'axios';

const Reactivacion = () => {

    const [reingreso, setReingreso] = useState({});
    const [mensaje, setMensaje] = useState({});
    const [busqueda, setBusqueda] = useState('');
    const [registros, setRegistros] = useState([]);
    const [registrosData, setRegistrosData] = useState({});
    const [mensajeRegistro, setMensajeRegistro] = useState({});
    const [form, setform] = useState({
        estadoAnterior : "", 
        fechaInicioCobroInput: "", 
        tipoCobro : ""  
    })

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
        setform({...form,
            [e.target.name]:e.target.value
        })
    }
    const consultarRegistros = async (numeroMembresia) => {
        setRegistros([]);
        setMensajeRegistro({});
        if (numeroMembresia) {
            try {
                const token = localStorage.getItem('token');
                console.log(token)
                const url = `${import.meta.env.VITE_BACKEND_URL}/reingreso/pago/${numeroMembresia}`;
                const options = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                };
                const respuesta = await axios.post(url,form, options);
                console.log(respuesta.data)
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


    return (
        <>
            <div>
                <h1 className='font-black text-4xl text-gray-500'>Reingreso</h1>
                <hr className='my-4' />
                <p className='mb-8'>Este módulo te permite reactivar</p>
            </div>
            <div className="container mx-auto p-6">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-customBlue">Registros por período</h1>
                </div>

                <div className="flex justify-center mb-8 items-center space-x-4">
                    <input
                        type="text"
                        placeholder="Ingrese el número de socio"
                        value={busqueda}
                        onChange={handleInputChange}
                        className="border border-gray-400 rounded p-3 w-64 shadow-sm"
                    />

                    <div className="w-1/3">
                        <input
                            type="date"
                            className='border-2 w-full p-2 mt-1 placeholder-gray-400 rounded-md'
                            placeholder="Ingrese fecha inicio de cobro YYYY-MM-DD"
                            name='fechaInicioCobroInput'
                            value={form.fechaInicioCobroInput}
                            onChange={handleChange}

                        />
                    </div>

                    <div className="w-1/3">
                        <input
                            id='tipoCobro'
                            type='text'
                            className='border-2 w-full p-2 mt-1 placeholder-gray-400 rounded-md'
                            placeholder='Ingrese tipo de cobro'
                            name='tipoCobro'
                            value={form.tipoCobro}
                            onChange={handleChange}
                        />
                    </div>

                    <button 
                        className="bg-customBlue hover:bg-blue-900 text-white px-6 py-2 rounded shadow"
                        onClick={handleBuscar}>
                        Buscar
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
                                <span className="text-gray-600 uppercase font-bold">Estado Proceso:</span>
                                {reingreso.EstadoProceso}
                            </p>
                            <p className="text-md text-gray-00 mt-4">
                                <span className="text-gray-600 uppercase font-bold">Fecha de liquidación:</span>
                                {reingreso.FechaFinalLiquidacion}
                            </p>
                        </div>

                        <div className="w-1/2 px-2">
                            <label
                                htmlFor='estadoAnterior'
                                className='text-gray-700 uppercase font-bold text-xs'>
                                Estado anterior:
                            </label>
                            <input
                                id='estadoAnterior'
                                type='text'
                                className='border-2 w-full p-1 mt-1 placeholder-gray-400 rounded-md mb-3'
                                placeholder='Ingrese estado anterior'
                                name='estadoAnterior'
                                //value={form.nombre}
                               // onChange={handleChange}
                            />
                        </div>
                    </div>
                )     
            }
            
            {Object.keys(mensajeRegistro).length > 0 && <Mensaje tipo={mensajeRegistro.tipo}>{mensajeRegistro.respuesta}</Mensaje>}

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full border-collapse">
                    <thead className="bg-customYellow text-slate-400">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Año</th>
                            <th className="border border-gray-300 px-4 py-2">Total Anual</th>
                            <th className="border border-gray-300 px-4 py-2">Total Patrimonial Anual</th>
                            <th className="border border-gray-300 px-4 py-2">Total Predial Anual</th>
                        </tr>

                     </thead>
                     <tbody>
                        {registros.length > 0 ? (
                            <>
                                {registros.map((row, index) => (
                                    <tr key={index} className="odd:bg-gray-100 even:bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-2 text-center">{row.anio}</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">{row.totalAnual.toFixed(1)}</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">{row.totalPatrimonialAnual}</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">{row.totalPredialAnual.toFixed(1)}</td>
                                    </tr>
                                ))}
                                <tr className="font-bold bg-gray-200">
                                    <td colSpan="3" className="border border-gray-300 px-4 py-2 text-center">Total Final</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                      
                                        {registrosData.totalFinal}
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

            <div className="flex space-x-4">
            <div className="w-1/2 px-2 mt-4">
                <label
                    htmlFor='observacion'
                    className='text-gray-700 uppercase font-bold text-xs'>
                    Observación:
                </label>
                <input
                    id='observacion'
                    type='text'
                    className='border-2 w-full p-1 mt-1 placeholder-gray-400 rounded-md mb-3'
                    placeholder='Ingrese la observación'
                    name='observacion'
                />
            </div>
            <div className="w-1/2 px-2 mt-4">
                <label
                    htmlFor='total'
                    className='text-gray-700 uppercase font-bold text-xs'>
                    Total Amnistía:
                </label>
                <div className='border-2 w-full p-1 mt-1 rounded-md mb-3'>
                    {registrosData.amnistia}
                </div>
            </div>
        </div>

            <button className="bg-gray-900 mt-4 hover:bg-blue-900 text-white px-6 py-1 rounded shadow">
                    Confirmar
            </button>
        </>
    )
}

export default Reactivacion