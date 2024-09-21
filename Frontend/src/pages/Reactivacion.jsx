import React, { useState } from "react";
import Mensaje from '../components/Alerts/Message';
import axios from 'axios';

const Reactivacion = () => {

    const [reingreso, setReingreso] = useState({});
    const [mensaje, setMensaje] = useState({});
    const [busqueda, setBusqueda] = useState('');

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
                console.log("reingreso: ", respuesta.data)
                setReingreso(respuesta.data);
                setMensaje({});
            } catch (error) {
                setMensaje({ respuesta: error.response.data.msg, tipo: false });
                setReingreso({});
            }
        }
    };

    const handleInputChange = (e) => {
        setBusqueda(e.target.value);
    };

    const handleBuscar = () => {
        consultarReingreso(busqueda);
        //consultarRegistroMigratorio(busqueda);
          
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

                <div className="flex justify-center mb-8">
                    <input
                        type="text"
                        placeholder="Ingrese el número de socio"
                        value={busqueda}
                        onChange={handleInputChange}
                        className="border border-gray-400 rounded p-3 w-64 mr-4 shadow-sm"
                    />
                    <button className="bg-customBlue hover:bg-blue-900 text-white px-6 py-2 rounded shadow"
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
                                {reingreso.data.Socio}
                            </p>
                            <p className="text-md text-gray-00 mt-4">
                                <span className="text-gray-600 uppercase font-bold">Titular:</span>
                                {reingreso.data.Titular}
                            </p>
                        </div>
                        <div>
                            <p className="text-md text-gray-00 mt-4">
                                <span className="text-gray-600 uppercase font-bold">Categoría:</span>
                                {reingreso.data.Categoria}
                            </p>
                            <p className="text-md text-gray-00 mt-4">
                                <span className="text-gray-600 uppercase font-bold">Fecha Nacimiento:</span>
                                {reingreso.data.FechaNacimiento}
                            </p>
                        </div>
                        <div>
                            <p className="text-md text-gray-00 mt-4">
                                <span className="text-gray-600 uppercase font-bold">Estado Proceso:</span>
                                {reingreso.data.EstadoProceso}
                            </p>
                            <p className="text-md text-gray-00 mt-4">
                                <span className="text-gray-600 uppercase font-bold">Fecha de liquidación:</span>
                                {reingreso.data.FechaFinalLiquidacion}
                            </p>
                        </div>
                    </div>
                )     
            }

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full border-collapse">
                    <thead className="bg-customYellow text-slate-400">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Fechas</th>
                            <th className="border border-gray-300 px-4 py-2">Categoría</th>
                            <th className="border border-gray-300 px-4 py-2">Cuota Mensual</th>
                            <th className="border border-gray-300 px-4 py-2">Cuota Período</th>
                        </tr>
                     </thead>
                    <tbody>
                        <tr  className="odd:bg-gray-100 even:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 text-center">{}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="flex space-x-4">
                <div className="w-1/2 px-2 mt-4" >
                    <label
                        htmlFor='observacion'
                        className='text-gray-700 uppercase font-bold text-xs'>
                        Observación:
                    </label>
                    <input
                        id='observacion'
                        type='text'
                        className='border-2 w-full p-1 mt-4 placeholder-gray-400 rounded-md mb-3'
                        placeholder='Ingrese la observación'
                        name='observacion'
                    />
                </div>
                <div className="w-1/2 px-2 mt-4">
                    <label
                        htmlFor='total'
                        className='text-gray-700 uppercase font-bold text-xs'>
                        Total Reactivación 50%:
                    </label>
                    <input
                        id='total'
                        type='number'
                        className='border-2 w-full p-1 mt-4 placeholder-gray-400 rounded-md mb-3'
                        placeholder='Ingrese el valor'
                        name='total'
                    />
                </div>
            </div>
            <button className="bg-gray-900 mt-4 hover:bg-blue-900 text-white px-6 py-1 rounded shadow">
                    Confirmar
            </button>
        </>
    )
}

export default Reactivacion