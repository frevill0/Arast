import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const formatoFecha = (dateString) => {
  if(!dateString) return null;
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const ConsultaAusentismo = async (req, res) => {

  const membresia = req.params.Membresia;
  console.log("Membresía recibida:", membresia);


  if (!membresia) {
    return res.status(400).send({ msg: "Perdón, pero no existe un socio con esa membresía" });
  }

  try {
    
    const encontrarSocio = await prisma.contactscm_fac_elec_arast.findFirst({
      where: {
        Membresia : membresia,
      },
      
    });

    if (!encontrarSocio) {
        return res.status(404).send({ msg: "No se encontró un socio con esa membresía" });
      }

      const estadosAusentes = ['Ausente', 'Ausente > 26', 'Ausente > 27', 'Retirado'];
      if (!estadosAusentes.includes(encontrarSocio.Estatus)) {
        console.log("Estatus:", encontrarSocio.Estatus);
        return res.status(404).send({ msg: "El socio no se encuentra ausente" });
      }

      const resultado = {
        Socio: encontrarSocio.Socio,
        Categoria: encontrarSocio.Categoria,
        Estatus: encontrarSocio.Estatus,
        Titular: encontrarSocio.Titular,
        FechaNacimiento: formatoFecha(encontrarSocio.FechaNac),
        Edad: encontrarSocio.Edad,
        FechaAusentismo: formatoFecha(encontrarSocio.Marca_Ausentes),
      }

    res.status(200).json({ res: 'Detalles del socio: ', data: resultado });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error interno del servidor" });
  }

};


export const RegistroMigratorio = () => {

  
}




export {
  ConsultaAusentismo,
};
