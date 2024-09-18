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
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-4/5 max-h-[80%] overflow-y-scroll">
            <h2 className="text-lg font-bold mb-4 text-center">Registro de Categorías</h2>
            <form onSubmit={handleSubmit}>
              {cuotas.map((cuota, index) => (
                <div key={index} className="mb-6 border-b pb-4">
                  <h3 className="font-semibold mb-2 text-gray-700">{cuota.categoria}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-700">Valor Cuota Presente</label>
                      <input
                        type="number"
                        name="valorCuotaPresente"
                        value={cuota.valorCuotaPresente}
                        onChange={(e) => handleChange(e, index)}
                        className="border p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="text-gray-700">Valor Cuota Ausente</label>
                      <input
                        type="number"
                        name="valorCuotaAusente"
                        value={cuota.valorCuotaAusente}
                        onChange={(e) => handleChange(e, index)}
                        className="border p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="text-gray-700">Valor Patrimonial Presente</label>
                      <input
                        type="number"
                        name="valorPatrimonialPresente"
                        value={cuota.valorPatrimonialPresente}
                        onChange={(e) => handleChange(e, index)}
                        className="border p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="text-gray-700">Valor Patrimonial Ausente</label>
                      <input
                        type="number"
                        name="valorPatrimonialAusente"
                        value={cuota.valorPatrimonialAusente}
                        onChange={(e) => handleChange(e, index)}
                        className="border p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="text-gray-700">Valor Predial</label>
                      <input
                        type="number"
                        name="valorPredial"
                        value={cuota.valorPredial}
                        onChange={(e) => handleChange(e, index)}
                        className="border p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="text-gray-700">Año</label>
                      <input
                        type="number"
                        name="anio"
                        value={cuota.anio}
                        onChange={(e) => handleChange(e, index)}
                        className="border p-2 w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
    
              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className="bg-customBlue text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Registrar
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="ml-4 bg-customBlue text-white px-6 py-2 rounded-lg hover:bg-red-700"
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