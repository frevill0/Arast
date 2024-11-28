import { useState } from 'react';
import FormularioFechas from '../components/FormularioFechas';
import Mensaje from '../components/Alerts/Message';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import LogoPrincipal from '../assets/LogoQTGC.png';

const convertImageToBase64 = (imgUrl) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
        img.src = imgUrl;
    });
};

const Reporte27 = () => {
    const [reporte, setReporte] = useState([]);
    const [mensaje, setMensaje] = useState({});

    const handleSubmit = async (fechaInicio, fechaFin) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/reporte/socios27`,
                { fechaInicio, fechaFin },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setReporte(response.data.data);
            setMensaje({});
        } catch (error) {
            setMensaje({
                respuesta: error.response?.data?.msg || "Error al generar el reporte",
                tipo: false
            });
        }
    };

    const generarPDF = async () => {
        const doc = new jsPDF();
        const base64Image = await convertImageToBase64(LogoPrincipal);
        
        doc.addImage(base64Image, 'PNG', 10, 5, 20, 20);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text('ARAST', 105, 15, { align: 'center' });
        doc.setFontSize(12);
        doc.text('Reporte de Socios que cumplen 27 años', 105, 22, { align: 'center' });
        
        if (reporte.length > 0) {
            doc.autoTable({
                startY: 40,
                head: [['Membresía', 'Socio', 'Fecha Nacimiento', 'Categoría', 'Estado', 'Edad', 'Fecha Cumple 27']],
                body: reporte.map(socio => [
                    socio.Membresia,
                    socio.Socio,
                    socio.FechaNac,
                    socio.Categoria,
                    socio.Estatus,
                    socio.Edad,
                    socio.FechaCumple27
                ]),
                headStyles: {
                    fillColor: [255, 255, 0],
                    textColor: [0, 0, 0]
                },
                styles: {
                    halign: 'center',
                    cellPadding: 5,
                }
            });
        }

        doc.save('reporte_socios_27.pdf');
    };

    return (
        <>
            <div>
                <h1 className='font-black text-4xl text-gray-500'>Reporte de Socios</h1>
                <hr className='my-4' />
                <p className='mb-8'>Este módulo te permite generar el reporte de socios que cumplen 27 años</p>
            </div>

            <FormularioFechas 
                titulo="Reporte de Socios que cumplen 27 años"
                onSubmit={handleSubmit}
            />

            {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}

            {reporte.length > 0 && (
                <>
                    <div className="overflow-x-auto mt-10">
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead className="bg-customBlue text-white">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Membresía</th>
                                    <th className="border border-gray-300 px-4 py-2">Socio</th>
                                    <th className="border border-gray-300 px-4 py-2">Fecha Nacimiento</th>
                                    <th className="border border-gray-300 px-4 py-2">Categoría</th>
                                    <th className="border border-gray-300 px-4 py-2">Estado</th>
                                    <th className="border border-gray-300 px-4 py-2">Edad</th>
                                    <th className="border border-gray-300 px-4 py-2">Fecha Cumple 27</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reporte.map((socio, index) => (
                                    <tr key={index} className="odd:bg-gray-100 even:bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-2 text-center">{socio.Membresia}</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">{socio.Socio}</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">{socio.FechaNac}</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">{socio.Categoria}</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">{socio.Estatus}</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">{socio.Edad}</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">{socio.FechaCumple27}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="text-center mt-6">
                        <button 
                            className="bg-customBlue hover:bg-blue-900 text-white px-6 py-3 rounded shadow-lg"
                            onClick={generarPDF}
                        >
                            Imprimir Reporte
                        </button>
                    </div>
                </>
            )}
        </>
    );
};

export default Reporte27; 