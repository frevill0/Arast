import React, { useState, useContext, useEffect } from 'react';
import { MdDeleteForever, MdNoteAdd } from "react-icons/md";
import Mensaje from '../components/Alerts/Message';
import axios from 'axios';
import ModalCuotas from "../components/Modals/ModalCuotas";
import AuthContext from '../context/AuthProvider';
import ModalConfirmacion from '../components/Modals/ModalConfirmacion';
const consultarCuotas = () =>{

    const [busqueda, setBusqueda] = useState('')
    const [mensaje, setMensaje] = useState({});
    const [mensajeD, setMensajeD] = useState({});
    const {auth} = useContext(AuthContext)

    const [cuota, setCuota] = useState([]);
    const [modalConfirmacion, setModalConfirmacion] = useState(false);
    const [anioAEliminar, setAnioAEliminar] = useState(null);

    // Obtener el año actual
    const añoActual = new Date().getFullYear();

    // useEffect para buscar automáticamente al montar el componente
    useEffect(() => {
        setBusqueda(añoActual.toString());
        consultarCuotas(añoActual.toString());
    }, []);

    const consultarCuotas = async (anio) => {
        setCuota({});
        setMensaje({});
        if (anio) {
            try {
                const token = localStorage.getItem('token');
                const url = `${import.meta.env.VITE_BACKEND_URL}/cuotas/${anio}`;
                const options = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                };
                const respuesta = await axios.get(url, options);
                setCuota(respuesta.data);
                setMensaje({});
            } catch (error) {
                setMensaje({ respuesta: error.response.data.message, tipo: false });
                setCuota({});
            }
        }
    };

    const handleInputChange = (e) => {
        setBusqueda(e.target.value);
    };

    const handleBuscar = () => {
        consultarCuotas(busqueda);     
    };

    const [modal, setModal] = useState(false)

    const handleModal = () => {
        setModal(!modal);

    };

    const closeModal = () => setModal(false);

    const handleDeleteClick = (anio) => {
        setAnioAEliminar(anio);
        setModalConfirmacion(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const token = localStorage.getItem('token')
            const url = `${import.meta.env.VITE_BACKEND_URL}/cuotas/${anioAEliminar}`
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const response = await axios.delete(url, options);
            setMensajeD({ respuesta: response.data.message, tipo: true });
            setCuota({});
        } catch (error) {
            setMensajeD({ respuesta: error.response.data.message, tipo: false });
        }
        setModalConfirmacion(false);
        setAnioAEliminar(null);
    };

    const handleCancelDelete = () => {
        setModalConfirmacion(false);
        setAnioAEliminar(null);
    };

    return (
        <>
            <div>
                <h1 className='font-black text-4xl text-customBlue'>Mantenimiento de Cuotas</h1>
                <hr className='my-4 border-customYellow' />
                <p className='mb-8 text-customBlue'>Este módulo te permite gestionar las cuotas del sistema.</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <input
                            type="text"
                            placeholder="Ingrese el año"
                            value={busqueda}
                            onChange={handleInputChange}
                            className="border-2 border-gray-300 rounded-lg p-2 w-48
                                     focus:ring-2 focus:ring-customYellow focus:border-customYellow 
                                     hover:border-customYellow transition-all"
                        />
                        <button 
                            className="bg-customBlue hover:bg-customYellow hover:text-customBlue
                                     text-white px-6 py-2 rounded-lg transition-all duration-300 
                                     transform hover:scale-105 shadow-lg flex items-center"
                            onClick={handleBuscar}
                        >
                            Buscar
                        </button>
                    </div>

                    {auth.rol === "administrador" && (
                        <div className="flex space-x-4">
                            <button 
                                className="bg-customBlue hover:bg-customYellow hover:text-customBlue
                                         text-white px-6 py-2 rounded-lg transition-all duration-300 
                                         transform hover:scale-105 shadow-lg flex items-center"
                                onClick={handleModal}
                            >
                                <MdNoteAdd className="w-5 h-5 mr-2" />
                                Nueva Cuota
                            </button>
                            <button 
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 
                                         rounded-lg transition-all duration-300 transform 
                                         hover:scale-105 shadow-lg flex items-center"
                                onClick={() => handleDeleteClick(busqueda)}
                            >
                                <MdDeleteForever className="w-5 h-5 mr-2" />
                                Eliminar
                            </button>
                        </div>
                    )}
                </div>

                {Object.keys(mensaje).length > 0 && (
                    <div className="mb-6">
                        <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse bg-white rounded-lg overflow-hidden">
                        <thead className="bg-customYellow text-slate-400">
                            <tr>
                                <th className="border border-gray-300 px-6 py-3 text-left">Categoría</th>
                                <th className="border border-gray-300 px-6 py-3 text-left">Cuota Presente</th>
                                <th className="border border-gray-300 px-6 py-3 text-left">Cuota Ausente</th>
                                <th className="border border-gray-300 px-6 py-3 text-left">Patrimonial Presente</th>
                                <th className="border border-gray-300 px-6 py-3 text-left">Patrimonial Ausente</th>
                                <th className="border border-gray-300 px-6 py-3 text-left">Cuota Predial</th>
                                <th className="border border-gray-300 px-6 py-3 text-left">Año</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cuota.length > 0 ? cuota.map((row, index) => (
                                <tr key= {index} className="odd:bg-gray-100 even:bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-2 text-center">{row.categoria}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{row.valorCuotaPresente}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{row.valorCuotaAusente}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{row.valorPatrimonialPresente}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{row.valorPatrimonialAusente}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{row.valorPredial}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{row.anio}</td>
                                 </tr>
                            )): (
                                <tr>
                                <td colSpan="7" className="text-center  py-5">No hay registros</td>
                                </tr>
                            )} 
                        </tbody>
                    </table>
                </div>
            </div>

            {modal && <ModalCuotas handleClose={closeModal}/>}
            {modalConfirmacion && (
                <ModalConfirmacion
                    mensaje={`¿Está seguro de eliminar las cuotas del año ${anioAEliminar}?`}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </>
    );
};

export default consultarCuotas