import React, { useState, useEffect } from "react";
import { MdInfo } from "react-icons/md";
import Mensaje from '../components/Alerts/Message';
import axios from 'axios';

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
    return (
        <>
            <div>
                <h1 className='font-black text-4xl text-gray-500'>Revisar Ausentismo</h1>
                <hr className='my-4' />
                <p className='mb-8'>Este módulo te permite visualizar ausentismos.</p>
            </div>
            <div className="container mx-auto p-6">

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
                  
                    <div className="flex items-center justify-center mb-6">
                    <label
                        htmlFor='Salida:'
                        className='text-gray-700 uppercase font-bold text-sm'>Liquida desde: </label>
                        <input
                            type="text"
                            className="border border-gray-300 rounded p-3 mr-2 shadow-sm"
                            placeholder="Fecha de Salida"
                            value={fechaSalida}
                            onChange={(e) => setFechaSalida(e.target.value)}
                        />
                       
                        <label
                        htmlFor='Entrada:'
                        className='text-gray-700  uppercase font-bold text-sm'>Comentario: </label>
                        <input
                            type="text"
                            className="border border-gray-300 rounded p-3 mr-2 shadow-sm"
                            placeholder="Ingresa un comentario"
                            value={fechaEntrada}
                            onChange={(e) => setFechaEntrada(e.target.value)}
                        />
                     </div>

                    {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}

                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                         <div className="text-center mb-10">
                             <h1 className="text-2xl text-left font-bold text-customBlue">Movimientos migratorios</h1>
                        </div>
                        <table className="min-w-full mt-4 border-collapse">
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
                        <div className="mt-4 text-center mb-10">
                             <h1 className="text-2xl text-left font-bold text-customBlue">Cuotas</h1>
                        </div>
                        <table className=" mt-4 min-w-full border-collapse">
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

                        <div className="text-center mt-4 mb-10">
                             <h1 className="text-2xl text-left font-bold text-customBlue">Patrimonial</h1>
                        </div>

                        <table className="min-w-full mt-4 border-collapse">
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

                    <div className="font-bold bg-gray-200 mt-6 text-lg text-center mx-auto p-4 w-1/2 rounded-lg shadow-lg">
                        <p>TOTAL A PAGAR: {(registrocuota.reduce((acc, row) => acc + row.totalPagar, 0) + registropatrimonial.reduce((acc, row) => acc + row.totalPagar, 0)).toFixed(2)}</p>
                    </div>

                    <div className="text-center mt-6 ">
                        <button className="bg-customBlue hover:bg-green-600 text-white px-6 py-3 rounded shadow-lg">
                            Confirmar
                        </button>

                        <button className="bg-customBlue ml-4 hover:bg-green-600 text-white px-6 py-3 rounded shadow-lg">
                            Imprimir Reporte
                        </button>
                    </div>
                </>
            )}
        </>
    );
};

export default RevisarAusentismo;
