import React, { useState, useEffect } from "react";
import { MdDeleteForever } from "react-icons/md";
import Mensaje from '../components/Alerts/Message';
import axios from 'axios';
import ModalCuotas from "../components/Modals/ModalCuotas";
const consultarCuotas = () =>{

    const [busqueda, setBusqueda] = useState('')
    const [mensaje, setMensaje] = useState({});
    const [cuota, setCuota] = useState([]);

    console.log("Data de las cuotas:",cuota)

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

    return (
        <>
             <div>
                <h1 className='font-black text-4xl text-gray-500'>Mantenimiento de Cuotas</h1>
                <hr className='my-4' />
                <p className='mb-8'>Este módulo te permite consultar cuotas por año.</p>
            </div>
            <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-900">Reactivación de Ausentismo</h1>
            </div>
            <div className="container mx-auto p-6">
               
                <div className="flex justify-center mb-8">
                    <input
                        type="text"
                        placeholder="Ingrese el año"
                        value={busqueda}
                        onChange={handleInputChange}
                        className="border border-gray-400 rounded p-3 w-64 mr-4 shadow-sm"
                    />
                    <button className="bg-gray-900 hover:bg-blue-900 text-white px-6 py-2 rounded shadow"
                        onClick={handleBuscar}>
                        Buscar
                    </button>
                </div>
            </div>
            {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full border-collapse">
                    <thead className="bg-customYellow text-slate-400">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Categoría</th>
                            <th className="border border-gray-300 px-4 py-2">Cuota Presente</th>
                            <th className="border border-gray-300 px-4 py-2">Cuota Ausente</th>
                            <th className="border border-gray-300 px-4 py-2">Patrimonial Presente</th>
                            <th className="border border-gray-300 px-4 py-2">Patrimonial Ausente</th>
                            <th className="border border-gray-300 px-4 py-2">Cuota Predial</th>
                            <th className="border border-gray-300 px-4 py-2">Año</th>
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
            <button className="bg-gray-900 mt-4 hover:bg-blue-900 text-white px-6 py-2 rounded shadow"
            onClick={handleModal}>
                Registrar nueva cuota
            </button>

            {modal && (<ModalCuotas/>)}


        
        
        </>
    )

}

export default consultarCuotas