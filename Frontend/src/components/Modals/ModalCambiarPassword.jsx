import React, { useState } from 'react';
import axios from 'axios';
import Mensaje from '../Alerts/Message';
import { MdClose, MdSave, MdCancel, MdLock } from 'react-icons/md';

const ModalCambiarPassword = ({ usuario, handleClose, actualizarTabla }) => {
    const [mensaje, setMensaje] = useState({});
    const [form, setForm] = useState({
        contrasena: '',
        confirmarContrasena: ''
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.contrasena !== form.confirmarContrasena) {
            setMensaje({ respuesta: "Las contraseñas no coinciden", tipo: false });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const url = `${import.meta.env.VITE_BACKEND_URL}/usuarios/cambiar-password/${usuario.username}`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };

            await axios.put(url, { contrasena: form.contrasena }, options);
            setMensaje({ respuesta: "Contraseña actualizada con éxito", tipo: true });
            setTimeout(() => {
                handleClose();
            }, 2000);
        } catch (error) {
            setMensaje({ respuesta: error.response?.data?.msg || "Error al actualizar la contraseña", tipo: false });
        }
    };

    return (
        <div className="fixed inset-0 bg-customBlue bg-opacity-50 backdrop-blur-sm flex justify-center items-center modal-backdrop">
            <div className="bg-white rounded-xl shadow-2xl w-[500px] p-8 relative transform transition-all animate-slideIn">
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-customBlue hover:text-customYellow transition-colors"
                >
                    <MdClose className="w-6 h-6" />
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-customBlue">Cambiar Contraseña</h2>
                    <p className="text-gray-500 mt-2">Usuario: {usuario.username}</p>
                    <div className="mt-2 h-1 w-32 bg-customYellow mx-auto rounded-full"></div>
                </div>

                {mensaje?.respuesta && (
                    <div className="mb-6">
                        <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="group relative">
                        <div className="absolute left-3 top-[38px] text-customBlue">
                            <MdLock className="w-5 h-5" />
                        </div>
                        <label className="block text-sm font-medium text-customBlue mb-2">
                            Nueva Contraseña
                        </label>
                        <input
                            type="password"
                            name="contrasena"
                            placeholder="Ingrese la nueva contraseña"
                            value={form.contrasena}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg
                                     focus:ring-2 focus:ring-customYellow focus:border-customYellow 
                                     hover:border-customYellow transition-all placeholder-gray-400"
                        />
                    </div>

                    <div className="group relative">
                        <div className="absolute left-3 top-[38px] text-customBlue">
                            <MdLock className="w-5 h-5" />
                        </div>
                        <label className="block text-sm font-medium text-customBlue mb-2">
                            Confirmar Nueva Contraseña
                        </label>
                        <input
                            type="password"
                            name="confirmarContrasena"
                            placeholder="Confirme la nueva contraseña"
                            value={form.confirmarContrasena}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg
                                     focus:ring-2 focus:ring-customYellow focus:border-customYellow 
                                     hover:border-customYellow transition-all placeholder-gray-400"
                        />
                    </div>

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

export default ModalCambiarPassword; 