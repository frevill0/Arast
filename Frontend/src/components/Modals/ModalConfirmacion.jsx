import React from 'react';
import { MdWarning } from 'react-icons/md';

const ModalConfirmacion = ({ mensaje, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center modal-backdrop">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-[400px] transform transition-all animate-fadeIn">
                <div className="text-center">
                    <MdWarning className="mx-auto text-yellow-500 w-16 h-16 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmar Eliminación</h3>
                    <p className="text-gray-500 mb-6">{mensaje}</p>
                </div>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 
                                 transition-colors duration-300 transform hover:scale-105"
                    >
                        Confirmar
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 
                                 transition-colors duration-300 transform hover:scale-105"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirmacion; 