import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Message from '../components/Alerts/Message'
import fondoLogin from '../assets/fondoLogin.jpeg'

export const Login = () => {
    const navigate = useNavigate()
    const [mensaje, setMensaje] = useState({})
    const [errors, setErrors] = useState({})

    const [form, setform] = useState({
        username: "",
        password: ""
    })

    const handleChange = (e) => {
        setform({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        const newErrors = {};

        // Validación de username
        if (!form.username) {
            newErrors.username = 'El nombre del usuario es obligatorio';
        }

        // Validación de la contraseña
        if (!form.password) {
            newErrors.password = 'La contraseña es obligatoria';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            console.log('Formulario enviado', form);
        }
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/usuarios/login`
            const respuesta = await axios.post(url, form)
            localStorage.setItem('token', respuesta.data.token)
            // setAuth(respuesta.data)
            navigate('/dashboard')
        } catch (error) {
            setMensaje({ respuesta: error.response.data.msg, tipo: false })
            setform({})
            setTimeout(() => {
                setMensaje({})
            }, 3000);
        }
    };

    return (
        <div className="flex h-screen justify-center items-center bg-cover bg-center" style={{ backgroundImage: `url(${fondoLogin})` }}>
            <div className="absolute top-10 text-black text-7xl font-bold text-center">
                ARAST
            </div>
            
            <div className="w-full md:w-1/3 bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-4 text-center">BIENVENIDO</h1>
                <p className="text-center mb-8">Ingresa tus datos para iniciar sesión</p>

                {Object.keys(Message).length > 0 && <Message tipo={Message.tipo}>{Message.respuesta}</Message>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor='username'
                            className="block text-sm font-semibold mb-2">Nombre de Usuario:</label>
                        <input
                            type="username"
                            name="username"
                            placeholder="ingresa tu nombre de usuario"
                            className={`block w-full p-2 rounded-md border ${errors.username ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-blue-500`}
                        >
                        </input>
                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">Contraseña:</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="********************"
                            value={form.password || ""} onChange={handleChange}
                            className={`block w-full p-2 rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-blue-500`}
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                    <button type="submit" className="w-full  bg-gray-900 text-white p-2 rounded-md hover:bg-blue-700">
                        Iniciar sesión
                    </button>
                </form>
            </div>
        </div>
    )
}
