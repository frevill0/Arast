import { useState } from 'react';
import Mensaje from '../components/Alerts/Message';

const FormularioFechas = ({ titulo, onSubmit }) => {
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [mensaje, setMensaje] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if ([fechaInicio, fechaFin].includes('')) {
            setMensaje({
                respuesta: 'Todos los campos son obligatorios',
                tipo: false
            });
            return;
        }

        if (new Date(fechaInicio) > new Date(fechaFin)) {
            setMensaje({
                respuesta: 'La fecha de inicio debe ser anterior a la fecha fin',
                tipo: false
            });
            return;
        }

        setMensaje({});
        onSubmit(fechaInicio, fechaFin);
    };

    return (
        <div className="container mx-auto p-6">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-customBlue">{titulo}</h1>
            </div>

            {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}

            <form onSubmit={handleSubmit} className="flex justify-center mb-8 items-center">
                <div className="mr-4">
                    <label className="text-gray-700 uppercase font-bold text-sm">Fecha Inicio:</label>
                    <input
                        type="date"
                        className="border-2 w-40 p-2 mt-1 placeholder-gray-400 rounded-md"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                    />
                </div>

                <div className="mr-4">
                    <label className="text-gray-700 uppercase font-bold text-sm">Fecha Fin:</label>
                    <input
                        type="date"
                        className="border-2 w-40 p-2 mt-1 placeholder-gray-400 rounded-md"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="bg-customBlue hover:bg-blue-900 text-white px-6 py-2 rounded shadow mt-6"
                >
                    Generar Reporte
                </button>
            </form>
        </div>
    );
};

export default FormularioFechas; 