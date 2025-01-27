import { useState } from "react";
import axios from "axios"

const ModalCuotas =  ({handleClose}) =>{

    const [cuotas, setcuotas] = useState([
        {
          categoria: "Activo >= 27",
          valorCuotaPresente: 0,
          valorCuotaAusente: 0,
          valorPatrimonialPresente: 0,
          valorPatrimonialAusente: 0,
          valorPredial: 0,
          anio: 0
        },
        {
          categoria: "Activo < 27",
          valorCuotaPresente: 0,
          valorCuotaAusente: 0,
          valorPatrimonialPresente: 0,
          valorPatrimonialAusente: 0,
          valorPredial: 0,
          anio: 0
        },
        {
          categoria: "Especial x Propios D",
          valorCuotaPresente: 0,
          valorCuotaAusente: 0,
          valorPatrimonialPresente: 0,
          valorPatrimonialAusente: 0,
          valorPredial: 0,
          anio: 0
        },
        {
          categoria: "Especial Viudo",
          valorCuotaPresente: 0,
          valorCuotaAusente: 0,
          valorPatrimonialPresente: 0,
          valorPatrimonialAusente: 0,
          valorPredial: 0,
          anio: 0
        },
        {
          categoria: "Vitalicio",
          valorCuotaPresente: 0,
          valorCuotaAusente: 0,
          valorPatrimonialPresente: 0,
          valorPatrimonialAusente: 0,
          valorPredial: 0,
          anio: 0
        },
        {
          categoria: "Corresponsal",
          valorCuotaPresente:0,
          valorCuotaAusente: 0,
          valorPatrimonialPresente:0,
          valorPatrimonialAusente: 0,
          valorPredial: 0,
          anio: 0
        },
      ]);
    
      const handleChange = (e, index) => {
        const { name, value } = e.target;
        const updatedcuotas = [...cuotas];
        updatedcuotas[index][name] = value;
        setcuotas(updatedcuotas);
      };
    
      const handleSubmit = async(e) => {
        e.preventDefault();
        // Validación para asegurarse de que los campos no estén vacíos
       const cuotasCompletas = cuotas.filter(cuota => {
          return (
            cuota.valorCuotaPresente !== 0 &&
            cuota.valorCuotaAusente !== 0 &&
            cuota.valorPatrimonialPresente !== 0 &&
            cuota.valorPatrimonialAusente !== 0 &&
            cuota.valorPredial !== 0 &&
            cuota.anio !== 0
          );
        });

  if (cuotasCompletas.length === 0) {
    alert("Por favor, complete todos los campos antes de enviar.");
    return;
  }
        // manejo el envío de datos 
        try {
          const token = localStorage.getItem('token')
          const url = `${import.meta.env.VITE_BACKEND_URL}/cuotas/crear`
          const options = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
        console.log("cuotas",cuotas)
        const respuesta = await axios.post(url,cuotas,options)
        console.log("respuesta: ", respuesta)
        setcuotas(respuesta)
        } catch (error) {
          console.log("Error: ", error);
        }
        handleClose(); // Para cerrar el modal después del registro
      };
    
      return (
        <div className="fixed inset-0 bg-customBlue bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-5xl max-h-[85vh] overflow-y-auto p-8 transform transition-all animate-slideIn mx-4">
                {/* Encabezado */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-customBlue">Registro de Cuotas</h2>
                    <div className="mt-2 h-1 w-32 bg-customYellow mx-auto rounded-full"></div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {cuotas.map((cuota, index) => (
                            <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                <h3 className="text-xl font-bold text-customBlue mb-4">{cuota.categoria}</h3>
                                <div className="space-y-4">
                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Valor Cuota Presente
                                        </label>
                                        <input
                                            type="number"
                                            name="valorCuotaPresente"
                                            value={cuota.valorCuotaPresente}
                                            onChange={(e) => handleChange(e, index)}
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg
                                                     focus:ring-2 focus:ring-customYellow focus:border-customYellow 
                                                     hover:border-customYellow transition-all"
                                        />
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Valor Cuota Ausente
                                        </label>
                                        <input
                                            type="number"
                                            name="valorCuotaAusente"
                                            value={cuota.valorCuotaAusente}
                                            onChange={(e) => handleChange(e, index)}
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg
                                                     focus:ring-2 focus:ring-customYellow focus:border-customYellow 
                                                     hover:border-customYellow transition-all"
                                        />
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Valor Patrimonial Presente
                                        </label>
                                        <input
                                            type="number"
                                            name="valorPatrimonialPresente"
                                            value={cuota.valorPatrimonialPresente}
                                            onChange={(e) => handleChange(e, index)}
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg
                                                     focus:ring-2 focus:ring-customYellow focus:border-customYellow 
                                                     hover:border-customYellow transition-all"
                                        />
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Valor Patrimonial Ausente
                                        </label>
                                        <input
                                            type="number"
                                            name="valorPatrimonialAusente"
                                            value={cuota.valorPatrimonialAusente}
                                            onChange={(e) => handleChange(e, index)}
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg
                                                     focus:ring-2 focus:ring-customYellow focus:border-customYellow 
                                                     hover:border-customYellow transition-all"
                                        />
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Valor Predial
                                        </label>
                                        <input
                                            type="number"
                                            name="valorPredial"
                                            value={cuota.valorPredial}
                                            onChange={(e) => handleChange(e, index)}
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg
                                                     focus:ring-2 focus:ring-customYellow focus:border-customYellow 
                                                     hover:border-customYellow transition-all"
                                        />
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Año
                                        </label>
                                        <input
                                            type="number"
                                            name="anio"
                                            value={cuota.anio}
                                            onChange={(e) => handleChange(e, index)}
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg
                                                     focus:ring-2 focus:ring-customYellow focus:border-customYellow 
                                                     hover:border-customYellow transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center gap-4 mt-8">
                        <button
                            type="submit"
                            className="flex items-center px-6 py-3 bg-customBlue text-white rounded-lg
                                     hover:bg-customYellow hover:text-customBlue transition-all duration-300 
                                     transform hover:scale-105 shadow-lg"
                        >
                            Registrar
                        </button>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg
                                     hover:bg-customYellow hover:text-customBlue transition-all duration-300 
                                     transform hover:scale-105 shadow-lg"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalCuotas