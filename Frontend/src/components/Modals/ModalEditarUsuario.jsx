import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import Mensaje from '../Alerts/Message';
import { MdClose, MdSave, MdCancel, MdPerson, MdEmail, MdWork } from 'react-icons/md';

const ModalEditarUsuario = ({ usuario, handleClose, actualizarTabla }) => {
    const [mensaje, setMensaje] = useState({});
    const [form, setForm] = useState({
        username: usuario.username,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol
    });

    const handleOutsideClick = useCallback((e) => {
        if (e.target.classList.contains('modal-backdrop')) {
            handleClose();
        }
    }, [handleClose]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [handleClose]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const url = `${import.meta.env.VITE_BACKEND_URL}/usuarios/${usuario.username}`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };

            await axios.put(url, form, options);
            setMensaje({ respuesta: "Usuario actualizado con éxito", tipo: true });
            
            if (actualizarTabla) actualizarTabla();
            
            setTimeout(() => {
                handleClose();
            }, 2000);

        } catch (error) {
            setMensaje({ 
                respuesta: error.response?.data?.message || "Error al actualizar el usuario", 
                tipo: false 
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-customBlue bg-opacity-50 backdrop-blur-sm flex justify-center items-center modal-backdrop">
            <div className="bg-white rounded-xl shadow-2xl w-[600px] p-8 relative transform transition-all animate-slideIn">
                {/* Botón de cerrar */}
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-customBlue hover:text-customYellow transition-colors"
                >
                    <MdClose className="w-6 h-6" />
                </button>

                {/* Encabezado */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-customBlue">Editar Usuario</h2>
                    <div className="mt-2 h-1 w-24 bg-customYellow mx-auto rounded-full"></div>
                </div>

                {mensaje?.respuesta && (
                    <div className="mb-6 animate-slideIn">
                        <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username Field */}
                    <div className="group relative">
                        <div className="absolute left-3 top-[38px] text-customBlue">
                            <MdEmail className="w-5 h-5" />
                        </div>
                        <label className="block text-sm font-medium text-customBlue mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            disabled
                            className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg 
                                     bg-gray-50 text-gray-500"
                        />
                    </div>

                    {/* Nombre Field */}
                    <div className="group relative">
                        <div className="absolute left-3 top-[38px] text-customBlue">
                            <MdPerson className="w-5 h-5" />
                        </div>
                        <label className="block text-sm font-medium text-customBlue mb-2">
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg
                                     focus:ring-2 focus:ring-customYellow focus:border-customYellow 
                                     hover:border-customYellow transition-all"
                        />
                    </div>

                    {/* Apellido Field */}
                    <div className="group relative">
                        <div className="absolute left-3 top-[38px] text-customBlue">
                            <MdPerson className="w-5 h-5" />
                        </div>
                        <label className="block text-sm font-medium text-customBlue mb-2">
                            Apellido
                        </label>
                        <input
                            type="text"
                            name="apellido"
                            value={form.apellido}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg
                                     focus:ring-2 focus:ring-customYellow focus:border-customYellow 
                                     hover:border-customYellow transition-all"
                        />
                    </div>

                    {/* Rol Field */}
                    <div className="group relative">
                        <div className="absolute left-3 top-[38px] text-customBlue">
                            <MdWork className="w-5 h-5" />
                        </div>
                        <label className="block text-sm font-medium text-customBlue mb-2">
                            Rol
                        </label>
                        <select
                            name="rol"
                            value={form.rol}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg
                                     focus:ring-2 focus:ring-customYellow focus:border-customYellow 
                                     hover:border-customYellow transition-all appearance-none bg-white"
                        >
                            <option value="administrador">Administrador</option>
                            <option value="usuario">Usuario</option>
                            <option value="consultor">Consultor</option>
                        </select>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-center gap-4 mt-8">
                        <button
                            type="submit"
                            className="flex items-center px-6 py-3 bg-customBlue text-white rounded-lg
                                     hover:bg-customYellow hover:text-customBlue transition-all duration-300 
                                     transform hover:scale-105 shadow-lg"
                        >
                            <MdSave className="w-5 h-5 mr-2" />
                            Guardar Cambios
                        </button>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg
                                     hover:bg-customYellow hover:text-customBlue transition-all duration-300 
                                     transform hover:scale-105 shadow-lg"
                        >
                            <MdCancel className="w-5 h-5 mr-2" />
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalEditarUsuario; 