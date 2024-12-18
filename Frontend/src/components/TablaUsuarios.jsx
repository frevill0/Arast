import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { MdDeleteForever, MdNoteAdd, MdInfo, MdPersonAdd, MdLock } from "react-icons/md";
import Message from "./Alerts/Message";
import ModalUsuarios from "./Modals/ModalUsuarios";
import ModalEditarUsuario from './Modals/ModalEditarUsuario';
import ModalConfirmacion from './Modals/ModalConfirmacion';
import ModalRegistroUsuario from './Modals/ModalRegistroUsuario';
import ModalCambiarPassword from './Modals/ModalCambiarPassword';

const TablaUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [modal, setModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalEditar, setModalEditar] = useState(false);
    const [selectedUserEdit, setSelectedUserEdit] = useState(null);
    const [modalConfirmacion, setModalConfirmacion] = useState(false);
    const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
    const [modalRegistro, setModalRegistro] = useState(false);
    const [modalPassword, setModalPassword] = useState(false);
    const [selectedUserPassword, setSelectedUserPassword] = useState(null);
    const [paginaActual, setPaginaActual] = useState(1);
    const [registrosPorPagina] = useState(10);

    // Calcular índices para paginación
    const indicePrimerRegistro = (paginaActual - 1) * registrosPorPagina;
    const registrosActuales = usuarios.slice(indicePrimerRegistro, indicePrimerRegistro + registrosPorPagina);
    const totalPaginas = Math.ceil(usuarios.length / registrosPorPagina);

    const listarUsuarios = async () => {
        try {
            const token = localStorage.getItem('token');
            const url = `${import.meta.env.VITE_BACKEND_URL}/usuarios/todos`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            const respuesta = await axios.get(url, options);
            setUsuarios(respuesta.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        listarUsuarios();
    }, []);

    const handleOpenModal = (usuario) => {
        setSelectedUser(usuario);
        setModal(true);
    };

    const handleCloseModal = () => {
        setModal(false);
        setSelectedUser(null);
    };

    const handleOpenEditModal = (usuario) => {
        setSelectedUserEdit(usuario);
        setModalEditar(true);
    };

    const handleCloseEditModal = () => {
        setModalEditar(false);
        setSelectedUserEdit(null);
        listarUsuarios();
    };

    const handleOpenRegistroModal = () => {
        setModalRegistro(true);
    };

    const handleCloseRegistroModal = () => {
        setModalRegistro(false);
        listarUsuarios();
    };

    const handleOpenPasswordModal = (usuario) => {
        setSelectedUserPassword(usuario);
        setModalPassword(true);
    };

    const handleClosePasswordModal = () => {
        setModalPassword(false);
        setSelectedUserPassword(null);
        listarUsuarios();
    };

    const handleDeleteClick = (username) => {
        setUsuarioAEliminar(username);
        setModalConfirmacion(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const url = `${import.meta.env.VITE_BACKEND_URL}/usuarios/eliminar/${usuarioAEliminar}`;
            const options = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.delete(url, options);
            listarUsuarios();
        } catch (error) {
            console.log(error);
        }
        setModalConfirmacion(false);
        setUsuarioAEliminar(null);
    };

    const handleCancelDelete = () => {
        setModalConfirmacion(false);
        setUsuarioAEliminar(null);
    };

    const cambiarPagina = (numeroPagina) => {
        setPaginaActual(numeroPagina);
    };

    return (
        <>
            <div>
                <h1 className='font-black text-4xl text-customBlue'>Mantenimiento de Usuarios</h1>
                <hr className='my-4 border-customYellow' />
                <p className='mb-8 text-customBlue'>Este módulo te permite gestionar los usuarios del sistema.</p>
            </div>

            {/* Botón Nuevo Usuario */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleOpenRegistroModal}
                    className="bg-customBlue text-white px-6 py-2 rounded-lg 
                             hover:bg-customYellow hover:text-customBlue
                             transition-all duration-300 transform hover:scale-105 
                             shadow-lg flex items-center"
                >
                    <MdPersonAdd className="w-5 h-5 mr-2" />
                    Nuevo Usuario
                </button>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className='p-3'>N°</th>
                            <th className='p-3'>Usuario</th>
                            <th className='p-3'>Nombre</th>
                            <th className='p-3'>Apellido</th>
                            <th className='p-3'>Rol</th>
                            <th className='p-3'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {registrosActuales.map((usuario, index) => (
                            <tr key={usuario.username} 
                                className="border-b hover:bg-gray-50 text-center transition-colors">
                                <td className="p-3">{indicePrimerRegistro + index + 1}</td>
                                <td className="p-3">{usuario.username}</td>
                                <td className="p-3">{usuario.nombre}</td>
                                <td className="p-3">{usuario.apellido}</td>
                                <td className="p-3 capitalize">{usuario.rol}</td>
                                <td className='p-3 text-center'>
                                    {/* Icono de Ver Detalles */}
                                    <button 
                                        className="inline-flex items-center justify-center w-8 h-8 mr-2
                                                 bg-customBlue bg-opacity-10 rounded-lg
                                                 hover:bg-customYellow hover:bg-opacity-20 
                                                 transition-all duration-300 group"
                                        onClick={() => handleOpenModal(usuario)}
                                    >
                                        <MdNoteAdd className="w-5 h-5 text-customBlue group-hover:text-customYellow 
                                                            transition-colors" />
                                    </button>

                                    {/* Icono de Editar */}
                                    <button 
                                        className="inline-flex items-center justify-center w-8 h-8 mr-2
                                                 bg-customYellow bg-opacity-10 rounded-lg
                                                 hover:bg-customYellow hover:bg-opacity-20 
                                                 transition-all duration-300 group"
                                        onClick={() => handleOpenEditModal(usuario)}
                                    >
                                        <MdInfo className="w-5 h-5 text-customYellow group-hover:text-customBlue 
                                                         transition-colors" />
                                    </button>

                                    {/* Icono de Cambiar Contraseña */}
                                    <button 
                                        className="inline-flex items-center justify-center w-8 h-8 mr-2
                                                 bg-green-50 rounded-lg
                                                 hover:bg-green-100 
                                                 transition-all duration-300 group"
                                        onClick={() => handleOpenPasswordModal(usuario)}
                                    >
                                        <MdLock className="w-5 h-5 text-green-600 group-hover:text-green-700 
                                                         transition-colors" />
                                    </button>

                                    {/* Icono de Eliminar */}
                                    <button 
                                        className="inline-flex items-center justify-center w-8 h-8
                                                 bg-red-50 rounded-lg
                                                 hover:bg-red-100 
                                                 transition-all duration-300 group"
                                        onClick={() => handleDeleteClick(usuario.username)}
                                    >
                                        <MdDeleteForever className="w-5 h-5 text-red-600 group-hover:text-red-700 
                                                                  transition-colors" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className="flex justify-center mt-4">
                <button
                    className="bg-customBlue text-white px-4 py-2 rounded-l-lg 
                             hover:bg-customYellow hover:text-customBlue transition-colors"
                    onClick={() => cambiarPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                >
                    Anterior
                </button>
                {[...Array(totalPaginas).keys()].map((numero) => (
                    <button
                        key={numero}
                        className={`px-4 py-2 ${
                            paginaActual === numero + 1 
                            ? 'bg-customYellow text-customBlue' 
                            : 'bg-customBlue text-white hover:bg-customYellow hover:text-customBlue'
                        } transition-colors`}
                        onClick={() => cambiarPagina(numero + 1)}
                    >
                        {numero + 1}
                    </button>
                ))}
                <button
                    className="bg-customBlue text-white px-4 py-2 rounded-r-lg 
                             hover:bg-customYellow hover:text-customBlue transition-colors"
                    onClick={() => cambiarPagina(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                >
                    Siguiente
                </button>
            </div>

            {/* Modales */}
            {modal && selectedUser && (
                <ModalUsuarios
                    usuario={selectedUser}
                    handleClose={handleCloseModal}
                />
            )}

            {modalEditar && selectedUserEdit && (
                <ModalEditarUsuario
                    usuario={selectedUserEdit}
                    handleClose={handleCloseEditModal}
                    actualizarTabla={listarUsuarios}
                />
            )}

            {modalRegistro && (
                <ModalRegistroUsuario
                    handleClose={handleCloseRegistroModal}
                    actualizarTabla={listarUsuarios}
                />
            )}

            {modalPassword && selectedUserPassword && (
                <ModalCambiarPassword
                    usuario={selectedUserPassword}
                    handleClose={handleClosePasswordModal}
                    actualizarTabla={listarUsuarios}
                />
            )}

            {modalConfirmacion && (
                <ModalConfirmacion
                    mensaje="¿Estás seguro de eliminar este usuario?"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </>
    );
};

export default TablaUsuarios;