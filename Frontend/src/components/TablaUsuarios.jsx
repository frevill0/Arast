import axios from "axios";
import { useContext,useEffect, useState } from "react";
import { MdDeleteForever,MdNoteAdd,MdInfo } from "react-icons/md";
import Message from "./Alerts/Message"
import {useNavigate} from 'react-router-dom'
import AuthContext from "../context/AuthProvider"

const TablaUsuarios = () => {

    const { auth } = useContext(AuthContext)
    const navigate =useNavigate()

    const [usuarios,setUsuarios]= useState([])

    const listarUsuarios = async () => { 
        try {
            const token = localStorage.getItem('token')
            const url = `${import.meta.env.VITE_BACKEND_URL}/usuarios/todos`
            const options={
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const respuesta = await axios.get(url,options)
            
            
            setUsuarios(respuesta.data,...usuarios)

        } catch (error) {
            console.log(error);
            
        }
     }
     const handleDelete=async (username)=>{
        try {
            const confirmar = confirm("¿Estas seguro de registrar la salida del usuario?")
            if(confirmar){
                const token = localStorage.getItem('token')
                const url = `${import.meta.env.VITE_BACKEND_URL}/usuarios/${username}`
                const headers = {
                    'Content-Type':'application/json',
                    Authorization:`Bearer ${token}`
                }
                const data = {
                    salida:new Date().toString()
                }
                await axios.delete(url,{headers, data});
                listarUsuarios()
            }
        } catch (error) {
            console.log(error);
        }
     }

     useEffect(() => {
        listarUsuarios()
    }, [])
    
    // Estado para la página actual
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 15;

  // Calcular el índice del primer y último registro en la página actual
  const indiceUltimoRegistro = paginaActual * registrosPorPagina;
  const indicePrimerRegistro = indiceUltimoRegistro - registrosPorPagina;

  // Obtener los registros actuales para la página
  const registrosActuales = usuarios.slice(indicePrimerRegistro, indiceUltimoRegistro);

  // Calcular el número total de páginas
  const totalPaginas = Math.ceil(usuarios.length / registrosPorPagina);

  // Función para cambiar de página
  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  return (
    <>
      {usuarios.length === 0 ? (
        <Message tipo={'active'}>{'No existen registros'}</Message>
      ) : (
        <>
          <table className='w-full mt-5 table-auto shadow-lg bg-white'>
            <thead className='bg-gray-800 text-slate-400'>
              <tr>
                <th className='p-2'>N°</th>
                <th className='p-2'>Usuario</th>
                <th className='p-2'>Nombre</th>
                <th className='p-2'>Apellido</th>
                <th className='p-2'>Rol</th>
                <th className='p-2'>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {registrosActuales.map((usuario, index) => (
                <tr className="border-b hover:bg-gray-300 text-center" key={usuario._id}>
                  <td>{indicePrimerRegistro + index + 1}</td> {/* Mostrar el número correcto en cada página */}
                  <td>{usuario.username}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.apellido}</td>
                  <td>{usuario.rol}</td>
                  <td className='py-2 text-center'>
                    <MdNoteAdd
                      className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2"
                      onClick={() => { navigate(`/usuariossdashboard/visualizar/${usuario._id}`) }}
                    />
                    <MdInfo
                      className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2"
                      onClick={() => navigate(`/usuariossdashboard/actualizar/${usuario._id}`)}
                    />
                    <MdDeleteForever
                      className="h-7 w-7 text-red-900 cursor-pointer inline-block"
                      onClick={() => { handleDelete(usuario._id) }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="flex justify-center mt-4">
            <button
              className="bg-gray-300 text-gray-800 px-3 py-1 rounded-l hover:bg-gray-400"
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1} // Desactivar el botón si está en la primera página
            >
              Anterior
            </button>
            {[...Array(totalPaginas).keys()].map((numero) => (
              <button
                key={numero}
                className={`px-3 py-1 ${paginaActual === numero + 1 ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-800'} hover:bg-gray-400`}
                onClick={() => cambiarPagina(numero + 1)}
              >
                {numero + 1}
              </button>
            ))}
            <button
              className="bg-gray-300 text-gray-800 px-3 py-1 rounded-r hover:bg-gray-400"
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas} // Desactivar el botón si está en la última página
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default TablaUsuarios