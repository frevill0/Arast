import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); 

const formatoFecha = (dateString) => {
    if (!dateString) return null;
  
    const date = new Date(dateString);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
  
    return `${day}/${month}/${year}`;
}

export const ConsultaSuspension = async (req, res) => {
    const membresia = req.params.Membresia;
    console.log("Membresía recibida:", membresia);
  
    if (!membresia) {
      return res.status(400).send({ msg: "Esa no es una membresia valida" });
    }
  
    try {
      const encontrarSocio = await prisma.contactscm_fac_elec_arast.findUnique({
        where: {
          Membresia: membresia,
        },
      });
    
      if (!encontrarSocio) {
        return res.status(400).send({ msg: "No se encontró un socio con esa membresía" });
      }
  
      const estadosAusentes = ['Ausente', 'Ausente > 26', 'Ausente > 27'];
      if (!estadosAusentes.includes(encontrarSocio.Estatus)) {
        console.log("Estatus:", encontrarSocio.Estatus);s
        return res.status(404).send({ msg: "El socio no se encuentra ausente" });
      }
  
      const resultado = {
        Socio: encontrarSocio.Socio,
        Categoria: encontrarSocio.Categoria,
        Estatus: encontrarSocio.Estatus,
        Titular: encontrarSocio.Titular,
        FechaNacimiento: formatoFecha(encontrarSocio.FechaNac),
        Edad: encontrarSocio.Edad,
        FechaAusentismo: formatoFecha(encontrarSocio.Marca_Ausentes)
      }
  
      res.status(200).json({ res: 'Detalles del socio: ', data: resultado });
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "Error interno del servidor" });
    }
};
