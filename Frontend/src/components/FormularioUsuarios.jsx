import { useState } from "react"
import axios from 'axios'
import Message from "./Alerts/Message"
import { useNavigate } from "react-router-dom"

export const FormularioUsuarios = ({usuario}) => {

    const navigate = useNavigate()
    const [form, setform] = useState({
        username: usuario?.username ??"",
        nombre: usuario?.nombre ??"",
        apellido: usuario?.apellido ??"",
        contrasena: usuario?.contrasena ??"",
        confirmarContrasena: usuario?.confirmarContrasena ??"",
        rol: usuario?.rol ??"",
    })


    const [mensaje, setMensaje] = useState({})
    const handleChange = (e) => {
        setform({...form,
            [e.target.name]:e.target.value
        })
    }
    const handleSubmit = async(e) => { 
        e.preventDefault()
        if (usuario?.username) {
            try {
                const token = localStorage.getItem('token')
                const url = `${import.meta.env.VITE_BACKEND_URL}/usuarios/${usuario?.username}`
                const options = {
                    headers: {
                        method: 'PUT',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
                const respuesta = await axios.put(url, form, options)
                setMensaje({respuesta:"usuario actualizado con éxito",tipo:true})
                navigate('usuarios/listar')
            } catch (error) {
                console.log(error);
                setMensaje({respuesta:error.response.data.msg,tipo:false})
            }
        }else{
            try {
                const token = localStorage.getItem('token')
                const url = `${import.meta.env.VITE_BACKEND_URL}/usuarios/crear`
                const options={
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
                console.log(form)
                const respuesta = await axios.post(url,form,options)
                console.log(respuesta);
                setMensaje({respuesta:"usuario registrado con éxito",tipo:true})
    
                setTimeout(()=>{
                    setMensaje({})
                    navigate('/dashboard/usuarios/listar')
                }, 3000);
            } catch (error) {
                    console.log(error);
                    setMensaje({respuesta:error.response.data.message,tipo:false})
            }
        }
    }

    


    return (
        
        <form onSubmit={handleSubmit}>
    {Object.keys(mensaje).length > 0 && (
        <Message tipo={mensaje.tipo}>{mensaje.respuesta}</Message>
    )}
    <div className="flex flex-wrap -mx-2">
    <div className="w-1/2 px-2">
            <label
                htmlFor='username'
                className='text-gray-700 uppercase font-bold text-xs'>
                Nombre de usuario:
            </label>
            <input
                id='username'
                type='text'
                className='border-2 w-full p-1 mt-1 placeholder-gray-400 rounded-md mb-3'
                placeholder='nombre del usuario'
                name='username'
                value={form.username}
                onChange={handleChange}
            />
        </div>
        
        <div className="w-1/2 px-2">
            <label
                htmlFor='nombre'
                className='text-gray-700 uppercase font-bold text-xs'>
                Nombre:
            </label>
            <input
                id='nombre'
                type='text'
                className='border-2 w-full p-1 mt-1 placeholder-gray-400 rounded-md mb-3'
                placeholder='nombre del usuario'
                name='nombre'
                value={form.nombre}
                onChange={handleChange}
            />
        </div>
        <div className="w-1/2 px-2">
            <label
                htmlFor='apellido'
                className='text-gray-700 uppercase font-bold text-xs'>
                Apellido:
            </label>
            <input
                id='apellido'
                type='text'
                className='border-2 w-full p-1 mt-1 placeholder-gray-400 rounded-md mb-3'
                placeholder='apellido del usuario'
                name='apellido'
                value={form.apellido}
                onChange={handleChange}
            />
        </div>
        <div className="w-1/2 px-2">
            <label
                htmlFor='contrasena'
                className='text-gray-700 uppercase font-bold text-xs'>
                Contraseña:
            </label>
            <input
                id='contrasena'
                type='password'
                className='border-2 w-full p-1 mt-1 placeholder-gray-400 rounded-md mb-3'
                placeholder='****************'
                name='contrasena'
                value={form.contrasena}
                onChange={handleChange}
            />
        </div>
        <div className="w-1/2 px-2">
            <label
                htmlFor='rol'
                className='text-gray-700 uppercase font-bold text-xs'>
                Rol:
            </label>
            <select
                id='rol'
                className='border-2 w-full p-1 mt-1 placeholder-gray-400 rounded-md mb-3'
                name='rol'
                value={form.rol}
                onChange={handleChange}
            >
                <option value='' disabled>
                    Seleccione el rol
                </option>
                <option value='administrador'>administrador</option>
                <option value='usuario'>usuario</option>
                <option value='consultor'>consultor</option>
            </select>
        </div>
        
        <div className="w-1/2 px-2">
            <label
                htmlFor='confirmarContrasena'
                className='text-gray-700 uppercase font-bold text-xs'>
                Confirmar contraseña:
            </label>
            <input
                id='confirmarContrasena'
                type='password'
                className='border-2 w-full p-1 mt-1 placeholder-gray-400 rounded-md mb-3'
                placeholder='****************'
                name='confirmarContrasena'
                value={form.confirmarContrasena}
                onChange={handleChange}
            />
        </div>
        
        
    </div>

    <div className="px-2 mt-3">
        <input
            type='submit'
            className='bg-gray-600 w-full p-2 text-slate-300 uppercase font-bold rounded-lg hover:bg-gray-900 cursor-pointer transition-all'
            value={usuario?.username ? 'Actualizar usuario' : 'Registrar usuario'}
        />
    </div>
</form>



    )
}