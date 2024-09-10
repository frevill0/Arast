import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const formatoFecha = (dateString) => {
  if (!dateString) return null;

  const date = new Date(dateString);

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

export const ConsultaAusentismo = async (req, res) => {
  const membresia = req.params.Membresia;
  console.log("Membresía recibida:", membresia);

  if (!membresia) {
    return res.status(400).send({ msg: "Perdón, pero no existe un socio con esa membresía" });
  }

  try {
    const encontrarSocio = await prisma.contactscm_fac_elec_arast.findUnique({
      where: {
        Membresia: membresia,
      },
    });
    console.log("fecha suspension:", encontrarSocio.fechaRetSep);

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
      FechaAusentismo: formatoFecha(encontrarSocio.fechaRetSep)
    }

    res.status(200).json({ res: 'Detalles del socio: ', data: resultado });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error interno del servidor" });
  }
};

export const RegistroMigratorio = async (req, res) => {
  try {
    const {
      membresia,
      fechaSalida,
      fechaEntrada,
      idLiquidacion,
      idUsuario,
    } = req.body;

    if (!fechaSalida || !fechaEntrada || !membresia) {
      return res.status(400).json({ msg: "Las fechas de salida, entrada y la membresía son requeridas" });
    }

    const socioData = await prisma.socios.findUnique({
      where: { membresia }, 
    });

    if (!socioData) {
      return res.status(404).json({ msg: "No se encontró un socio con esa membresía" });
    }

    const ultimoRegistro = await prisma.registroMovMigracion.findFirst({
      where: { socio: socioData.socio },
      orderBy: { fechaEntreda: 'desc' }  
    });

    let diasEnPais = 0;
    
    if (ultimoRegistro) {
      const ultimaFechaEntrada = new Date(ultimoRegistro.fechaEntreda);
      const nuevaFechaSalida = new Date(fechaSalida);

      diasEnPais = Math.floor((nuevaFechaSalida - ultimaFechaEntrada) / (1000 * 60 * 60 * 24));
    }

    const salida = new Date(fechaSalida);
    const entrada = new Date(fechaEntrada);
    const diasExterior = Math.floor((entrada - salida) / (1000 * 60 * 60 * 24)); 

    const nuevoRegistro = await prisma.registroMovMigracion.create({
      data: {
        socio: socioData.socio, 
        membresia: socioData.membresia,
        fechaSalida: salida,
        fechaEntreda: entrada,
        exterior: diasExterior,  
        pais: diasEnPais >= 0 ? diasEnPais : 0,  
        estadoMigratorio: "Abierto",  
        idLiquidacion,
        categoriaSocio: socioData.categoriaSocio,  
        estadoSocio: socioData.estadoSocio,  
        comentario: "N/A",  
        valorAdicional: 0,  
        descripcionValor: "N/A",  
        idUsuario
      }
    });

    res.status(201).json({ msg: "Registro creado con éxito", data: nuevoRegistro });
  } catch (error) {
    console.error("Error al crear el registro migratorio:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

