import { useState } from "react";


const ModalCuotas =  ({handleClose}) =>{

    const [categorias, setCategorias] = useState([
        {
          categoria: "Activo >= 27",
          valorCuotaPresente: "",
          valorCuotaAusente: "",
          valorPatrimonialPresente: "",
          valorPatrimonialAusente: "",
          valorPredial: "",
          anio: "",
        },
        {
          categoria: "Activo < 27",
          valorCuotaPresente: "",
          valorCuotaAusente: "",
          valorPatrimonialPresente: "",
          valorPatrimonialAusente: "",
          valorPredial: "",
          anio: "",
        },
        {
          categoria: "Especial x Propios D",
          valorCuotaPresente: "",
          valorCuotaAusente: "",
          valorPatrimonialPresente: "",
          valorPatrimonialAusente: "",
          valorPredial: "",
          anio: "",
        },
        {
          categoria: "Especial Viudo",
          valorCuotaPresente: "",
          valorCuotaAusente: "",
          valorPatrimonialPresente: "",
          valorPatrimonialAusente: "",
          valorPredial: "",
          anio: "",
        },
        {
          categoria: "Vitalicio",
          valorCuotaPresente: "",
          valorCuotaAusente: "",
          valorPatrimonialPresente: "",
          valorPatrimonialAusente: "",
          valorPredial: "",
          anio: "",
        },
        {
          categoria: "Corresponsal",
          valorCuotaPresente:"",
          valorCuotaAusente: "",
          valorPatrimonialPresente:"",
          valorPatrimonialAusente: "",
          valorPredial: "",
          anio: "",
        },
      ]);
    
      const handleChange = (e, index) => {
        const { name, value } = e.target;
        const updatedCategorias = [...categorias];
        updatedCategorias[index][name] = value;
        setCategorias(updatedCategorias);
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        // manejo el envío de datos 
        
        console.log(categorias);
        handleClose(); // Para cerrar el modal después del registro
      };
    
      return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-4/5 max-h-[80%] overflow-y-scroll">
            <h2 className="text-lg font-bold mb-4 text-center">Registro de Categorías</h2>
            <form onSubmit={handleSubmit}>
              {categorias.map((categoria, index) => (
                <div key={index} className="mb-6 border-b pb-4">
                  <h3 className="font-semibold mb-2 text-gray-700">{categoria.categoria}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-700">Valor Cuota Presente</label>
                      <input
                        type="number"
                        name="valorCuotaPresente"
                        value={categoria.valorCuotaPresente}
                        onChange={(e) => handleChange(e, index)}
                        className="border p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="text-gray-700">Valor Cuota Ausente</label>
                      <input
                        type="number"
                        name="valorCuotaAusente"
                        value={categoria.valorCuotaAusente}
                        onChange={(e) => handleChange(e, index)}
                        className="border p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="text-gray-700">Valor Patrimonial Presente</label>
                      <input
                        type="number"
                        name="valorPatrimonialPresente"
                        value={categoria.valorPatrimonialPresente}
                        onChange={(e) => handleChange(e, index)}
                        className="border p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="text-gray-700">Valor Patrimonial Ausente</label>
                      <input
                        type="number"
                        name="valorPatrimonialAusente"
                        value={categoria.valorPatrimonialAusente}
                        onChange={(e) => handleChange(e, index)}
                        className="border p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="text-gray-700">Valor Predial</label>
                      <input
                        type="number"
                        name="valorPredial"
                        value={categoria.valorPredial}
                        onChange={(e) => handleChange(e, index)}
                        className="border p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="text-gray-700">Año</label>
                      <input
                        type="number"
                        name="anio"
                        value={categoria.anio}
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
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Registrar
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="ml-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-700"
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