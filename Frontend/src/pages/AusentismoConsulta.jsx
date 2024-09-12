import React, { useState , useEffect} from "react";
import { MdDeleteForever} from "react-icons/md";
import Mensaje from '../components/Alerts/Message'
import axios from 'axios';

const AusentismoConsulta = () => {

      const [ausentismo, setAusentismo]=useState({})
      const [registroMigratorio, setRegistroMigratorio]=useState({})
      const [mensaje, setMensaje] = useState({})
      const [busqueda, setBusqueda] = useState(''); // Para manejar el input del campo de búsqueda
      const [fechaSalida, setFechaSalida] = useState('');
      const [fechaEntrada, setFechaEntrada] = useState('');

        const consultarAusentismo = async (numeroMembresia) =>{
            setAusentismo({})
            setMensaje({})
            if(numeroMembresia){
            try {
                const token = localStorage.getItem('token')
                const url = `${import.meta.env.VITE_BACKEND_URL}/ausentismo/${numeroMembresia}`
                const options = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
                const respuesta = await axios.get(url, options)
                setAusentismo(respuesta.data)
                consultarRegistroMigratorio(numeroMembresia)
                setMensaje({})

            } catch (error) {
                setMensaje({ respuesta: error.response.data.msg, tipo: false })
                setAusentismo({})
            }
            }
        }
        

      // Manejar el cambio en el input
        const handleInputChange = (e) => {
            setBusqueda(e.target.value);
        };

        // Manejar la búsqueda cuando se hace clic en el botón
        const handleBuscar = () => {
            //setNumeroMembresia(busqueda);
            consultarAusentismo(busqueda)
        };

        const handleSubmit = async (numeroMembresia) => {
            try {
                const confirmar = confirm("¿Está seguro de registrar la fecha?")
                if(confirmar){
                const token = localStorage.getItem('token')
                const url = `${import.meta.env.VITE_BACKEND_URL}/ausentismo/registroMigratorio`
                const form = {
                    numeroMembresia,
                    fechaSalida,
                    fechaEntrada
                  };
                const options={
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
                const respuesta = await axios.post(url,form,options)
                setMensaje({respuesta:"Fechas registradas correctamente",tipo:true})
            }
            } catch (error) {
                setMensaje({respuesta:error.response.data.msg,tipo:false})
            }
        }

        const consultarRegistroMigratorio = async (numeroMembresia) =>{
            setAusentismo({})
            setMensaje({})
            if(numeroMembresia){
            try {
                const token = localStorage.getItem('token')
                const url = `${import.meta.env.VITE_BACKEND_URL}/ausentismo/consultarRegistroMigratorio/${numeroMembresia}`
                const options = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
                const respuesta = await axios.get(url, options)
                setRegistroMigratorio(respuesta.data)
                setMensaje({})

            } catch (error) {
                setMensaje({ respuesta: error.response.data.msg, tipo: false })
                setRegistroMigratorio({})
            }
            }
        }
    return (
        <>
            <div>
                <h1 className='font-black text-4xl text-gray-500'> Registro Migratorio</h1>
                <hr className='my-4' />
                <p className='mb-8'>Este módulo te permite realizar el registro migratorio de los socios mediante su membresia.</p>
            </div>

            <div className="container mx-auto p-6">
            {/* Título */}
                <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-900">Reactivación de Ausentismo</h1>
                </div>

            {/* Sección de búsqueda */}
                <div className="flex justify-center mb-8">
                    <input 
                        type="text" 
                        placeholder="Ingrese el número de socio" 
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
            {/* Información del socio */}
            {
            Object.keys(ausentismo).length != 0 ?
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
                            <span className="text-gray-600 uppercase font-bold">Categoría:  </span> 
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
            ):(
                Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
            )
            }
        
            {ausentismo.data && ausentismo.data.FechaAusentismo &&(
            <>
                {/* Título Movimiento Migratorio */}
                <div className="text-center mb-6">
                <h2 className="text-3xl font-semibold text-gray-900">Movimiento Migratorio</h2>
                </div>

                {/* Formulario de movimiento migratorio */}
                <div className="flex items-center justify-center mb-6">
                    <input 
                        type="date" 
                        className="border border-gray-300 rounded p-3 mr-2 shadow-sm"
                        placeholder="Fecha de Salida"
                        value={fechaSalida}
                        onChange={(e) => setFechaSalida(e.target.value)}
                    />
                    <input 
                        type="date" 
                        className="border border-gray-300 rounded p-3 mr-2 shadow-sm"
                        placeholder="Fecha de Entrada"
                        value={fechaEntrada}
                        onChange={(e) => setFechaEntrada(e.target.value)}
                    />
                    <button className="bg-gray-900 hover:bg-blue-900 text-white px-6 py-2 rounded shadow"
                    onClick={() => { handleSubmit(numeroMembresia) }}>
                        Agregar
                    </button>
                </div>

                {/* Tabla de Movimientos */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full border-collapse">
                        <thead className="bg-gray-900 text-white">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Fecha Salida</th>
                            <th className="border border-gray-300 px-4 py-2">Fecha Entrada</th>
                            <th className="border border-gray-300 px-4 py-2">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {registroMigratorio.map((row, index) => (
                            <tr key={index} className="odd:bg-gray-100 even:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 text-center">{row.fechaSalida}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{row.fechaEntrada}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                                <MdDeleteForever className="h-7 w-7 text-red-900 cursor-pointer inline-block"/>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Botón de confirmación */}
                <div className="text-center mt-6">
                    <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded shadow-lg">
                        Confirmar
                    </button>
                </div>
            </>
            )}
         </>
    )
}

export default AusentismoConsulta