import axios from 'axios'
import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Message from '../components/Alerts/Message'
import fondoLogin from '../assets/fondoLogin.jpeg'
import AuthContext from '../context/AuthProvider'

export const Login = () => {
    const navigate = useNavigate()
    const {setAuth, perfil} = useContext(AuthContext)
    const [mensaje, setMensaje] = useState({})
    const [errors] = useState({})

    const [form, setform] = useState({
        username: "",
        contrasena: ""
    })

    const handleChange = (e) => {
        setform({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

     const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/usuarios/login`
            const respuesta = await axios.post(url, form)
            localStorage.setItem('token', respuesta.data.token)
            setAuth(respuesta.data)
            await perfil(respuesta.data.token)
            navigate('/dashboard');
        } catch (error) {
            console.log(error.response.data)
            setMensaje({ respuesta: error.response.data.error, tipo: false });
            setform({})
            setTimeout(() => {
                setMensaje({})
            }, 3000);
        }
    };
   
    return (
        <div className="flex h-screen justify-center items-center bg-cover bg-center" style={{ backgroundImage: `url(${fondoLogin})` }}>
            <div className="absolute top-10 text-black text-6xl font-bold text-center">
                ARAST
            </div>
            
            <div className="w-full md:w-1/3 bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-4 text-center">BIENVENIDO</h1>
                <p className="text-center mb-8">Ingresa tus datos para iniciar sesión</p>

                {Object.keys(mensaje).length > 0 && <Message tipo={mensaje.tipo}>{mensaje.respuesta}</Message>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor='username'
                            className="block text-sm font-semibold mb-2">Nombre de Usuario:</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="ingresa tu nombre de usuario"
                            value={form.username || ""} onChange={handleChange}
                            className={`block w-full p-2 rounded-md border ${errors.username ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-blue-500`}
                        >
                        </input>

                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">Contraseña:</label>
                        <input
                            type="password"
                            name="contrasena"
                            placeholder="********************"
                            value={form.contrasena || ""} onChange={handleChange}
                            className={`block w-full p-2 rounded-md border ${errors.contrasena ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-blue-500`}
                        />
                    </div>
                    <button type="submit" className="w-full  bg-gray-900 text-white p-2 rounded-md hover:bg-blue-700">
                        Iniciar sesión
                    </button>
                </form>
            </div>
        </div>
    )
}
