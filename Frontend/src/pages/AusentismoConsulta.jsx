import React, { useState, useEffect } from "react";
import { MdDeleteForever } from "react-icons/md";
import Mensaje from '../components/Alerts/Message';
import axios from 'axios';

const AusentismoConsulta = () => {
    const [ausentismo, setAusentismo] = useState({});
    const [registroMigratorio, setRegistroMigratorio] = useState([]);
    const [mensaje, setMensaje] = useState({});
    const [mensajeRegistro, setMensajeRegistro] = useState({});
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
          
    };

    
    

    const handleSubmit = async (membresia) => {
        try {
            const confirmar = confirm("¿Está seguro de registrar la fecha?");
            if (confirmar) {
                const token = localStorage.getItem('token');
                const url = `${import.meta.env.VITE_BACKEND_URL}/ausentismo/registroMigratorio`;
                const form = {
                    membresia,
                    fechaSalida,
                    fechaEntrada
                };
                const options = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                };
                const respuesta = await axios.post(url, form, options);
                setMensaje({ respuesta: "Fechas registradas correctamente", tipo: true });
                // Refrescar los datos después de registrar
                consultarRegistroMigratorio(busqueda);
            }
        } catch (error) {
            console.log(error);
            setMensaje({ respuesta: error.response.data.msg, tipo: false });
        }
    };

    const consultarRegistroMigratorio = async (numeroMembresia) => {
        setRegistroMigratorio([]);
        setMensajeRegistro({});
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
                setMensajeRegistro({});
            } catch (error) {
                setMensajeRegistro({ respuesta: error.response.data.msg, tipo: false });
                setRegistroMigratorio([]);
            }
        }
    };

    return (
        <>
            <div>
                <h1 className='font-black text-4xl text-gray-500'>Registro Migratorio</h1>
                <hr className='my-4' />
                <p className='mb-8'>Este módulo te permite realizar el registro migratorio de los socios mediante su membresia.</p>
            </div>
            <div className="container mx-auto p-6">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-customBlue">Reactivación de Ausentismo</h1>
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
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-semibold text-gray-900">Movimiento Migratorio</h2>
                    </div>

                    <div className="flex items-center justify-center mb-6">
                    <label
                        htmlFor='Salida:'
                        className='text-gray-700 uppercase font-bold text-sm'>Fecha de salida</label>
                        <input
                            type="date"
                            className="border border-gray-300 rounded p-3 mr-2 shadow-sm"
                            placeholder="Fecha de Salida"
                            value={fechaSalida}
                            onChange={(e) => setFechaSalida(e.target.value)}
                        />
                       
                        <label
                        htmlFor='Entrada:'
                        className='text-gray-700  uppercase font-bold text-sm'>Fecha de entrada</label>
                        <input
                            type="date"
                            className="border border-gray-300 rounded p-3 mr-2 shadow-sm"
                            placeholder="Fecha de Entrada"
                            value={fechaEntrada}
                            onChange={(e) => setFechaEntrada(e.target.value)}
                        />
                        <button className="bg-gray-900 hover:bg-blue-900 text-white px-6 py-2 rounded shadow"
                            onClick={() => { handleSubmit(busqueda) }}>
                            Agregar
                        </button>
                    </div>

                    {Object.keys(mensajeRegistro).length > 0 && <Mensaje tipo={mensajeRegistro.tipo}>{mensajeRegistro.respuesta}</Mensaje>}

                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full border-collapse">
                            <thead className="bg-customYellow text-slate-400">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Fecha Salida</th>
                                    <th className="border border-gray-300 px-4 py-2">Fecha Entrada</th>
                                    <th className="border border-gray-300 px-4 py-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registroMigratorio.length > 0 ? registroMigratorio.map((row, index) => (
                                    <tr key={index} className="odd:bg-gray-100 even:bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-2 text-center">{row.fechaSalida}</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">{row.fechaEntreda || `No disponible`}</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            <MdDeleteForever className="h-7 w-7 text-red-900 cursor-pointer inline-block" />
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="3" className="text-center py-4">No hay registros</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="text-center mt-6">
                        <button className="bg-gray-900 hover:bg-gray-600 text-white px-6 py-3 rounded shadow-lg">
                            Revisar
                        </button>
                    </div>
                </>
            )}
        </>
    );
};

export default AusentismoConsulta;
