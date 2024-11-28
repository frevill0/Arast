import React, { useCallback, useEffect } from 'react';
import { MdClose, MdPerson, MdBadge, MdWork } from 'react-icons/md';

const ModalUsuarios = ({ usuario, handleClose }) => {
  // Manejador para cerrar con click fuera del modal
  const handleOutsideClick = useCallback((e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      handleClose();
    }
  }, [handleClose]);

  // Manejador para cerrar con la tecla ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleClose]);

  return (
    <div 
      className="fixed inset-0 bg-customBlue bg-opacity-50 backdrop-blur-sm flex justify-center items-center modal-backdrop"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-[500px] p-8 relative transform transition-all animate-slideIn">
        {/* Botón de cerrar en la esquina */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-customBlue hover:text-customYellow transition-colors"
        >
          <MdClose className="w-6 h-6" />
        </button>

        {/* Encabezado */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-customBlue">Detalles del Usuario</h2>
          <div className="mt-2 h-1 w-32 bg-customYellow mx-auto rounded-full"></div>
        </div>

        {/* Contenido */}
        <div className="space-y-6">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <MdPerson className="w-6 h-6 text-customBlue mr-3" />
            <div>
              <p className="text-sm text-gray-500">Username</p>
              <p className="font-semibold text-customBlue">{usuario.username}</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <MdBadge className="w-6 h-6 text-customBlue mr-3" />
            <div>
              <p className="text-sm text-gray-500">Nombre Completo</p>
              <p className="font-semibold text-customBlue">{`${usuario.nombre} ${usuario.apellido}`}</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <MdWork className="w-6 h-6 text-customBlue mr-3" />
            <div>
              <p className="text-sm text-gray-500">Rol</p>
              <p className="font-semibold text-customBlue capitalize">{usuario.rol}</p>
            </div>
          </div>
        </div>

        {/* Botón de cerrar en la parte inferior */}
        <div className="mt-8 text-center">
          <button
            onClick={handleClose}
            className="bg-customBlue text-white px-6 py-2 rounded-lg
                     hover:bg-customYellow hover:text-customBlue 
                     transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalUsuarios; 