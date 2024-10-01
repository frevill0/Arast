import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); 

const formatoFecha = (dateString) => {
    if (!dateString) return null;

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');  
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
}

export const ConsultaSuspension = async (req, res) => {
  const membresia = req.params.Membresia;  
  console.log("Membresía recibida:", membresia);

  if (!membresia) {
    return res.status(400).send({ msg: "Esa no es una membresía válida" });
  }

  try {
    const encontrarSocio = await prisma.contactscm_fac_elec_arast.findUnique({
      where: {
        Membresia: membresia,
      },
    });

    console.log(encontrarSocio)

    if (!encontrarSocio) {
      return res.status(400).send({ msg: "No se encontró un socio con esa membresía" });
    }

    if (encontrarSocio.Estatus !== "Suspensión Temporal") {
      return res.status(400).send({ msg: "El socio no está en Suspensión Temporal" });
    }

    const estadoAnterior = await prisma.vw_estado_anterior_susp_temporal.findFirst({
      where: {
        membresia: membresia,
      },
    });

    if (!estadoAnterior) {
      return res.status(400).send({ msg: "No se encontró el estado anterior para esa membresía" });
    }

    const fechaActual = new Date();
    const ultimoDiaDelMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);

    const resultado = {
      Socio: encontrarSocio.Socio,
      Categoria: encontrarSocio.Categoria,  
      Titular: encontrarSocio.Titular,     
      Estatus: encontrarSocio.Estatus,
      FechaNacimiento: formatoFecha(encontrarSocio.FechaNac),
      Edad: encontrarSocio.Edad,
      FechaSuspension: formatoFecha(encontrarSocio.Marca_Suspension),
      EstadoAnterior: estadoAnterior.Estatus,
      FechaFinalLiquidacion: formatoFecha(fechaActual), 
      EstadoProceso: "Abierto",
      FechaFinalSuspension: formatoFecha(ultimoDiaDelMes),  // Último día del mes
    };

    res.status(200).json({ res: 'Detalles del socio y suspensión:', data: resultado });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error interno del servidor" });
  }
};

export const consultaPagoSuspension = async (req, res) => {
  const membresia = req.params.Membresia;
  console.log("Membresía recibida:", membresia);

  if (!membresia) {
    return res.status(400).send({ msg: "Esa no es una membresía válida" });
  }

  try {
    // Obtener la fecha de suspensión
    const estadoSuspension = await prisma.contactscm_fac_elec_arast.findFirst({
      where: {
        Membresia: membresia,
      },
      select: {
        Marca_Suspension: true,
      },
    });

    if (!estadoSuspension) {
      return res.status(400).send({ msg: "No se encontró la suspensión para esa membresía" });
    }
    
    const { Marca_Suspension } = estadoSuspension;

    // Calcular la fecha de finalización (último día del mes actual)
    const fechaActual = new Date();
    const ultimoDiaDelMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);

    // Calcular todos los meses entre la fecha de suspensión y la fecha final
    const meses = [];
    let fechaMes = new Date(Marca_Suspension);

    // Comenzar desde el siguiente mes
    fechaMes.setMonth(fechaMes.getMonth() + 1);

    let totalAPagar = 0; // Acumulador para el total a pagar

    while (fechaMes <= ultimoDiaDelMes) {
      const dia = fechaMes.getDate();
      meses.push(new Date(fechaMes));

      // Incrementar el mes
      fechaMes.setMonth(fechaMes.getMonth() + 1);
      
      // Ajustar el día si el nuevo mes tiene menos días
      if (fechaMes.getDate() < dia) {
        fechaMes.setDate(0);
      }
    }

    // Preparar el resultado
    const resultado = [];

    for (const mes of meses) {
      const anio = mes.getFullYear();
      const mesNum = mes.getMonth(); // Mes en formato 0-11

      // Obtener la categoría del socio
      const socio = await prisma.contactscm_fac_elec_arast.findUnique({
        where: { Membresia: membresia },
        select: { Categoria: true },
      });

      if (!socio) {
        return res.status(400).send({ msg: "No se encontró el socio" });
      }

      const { Categoria } = socio;

      // Consultar cuotas en la tabla Cuota
      const cuota = await prisma.cuota.findFirst({
        where: {
          categoria: Categoria,
          anio: anio,
        },
      });

      if (cuota) {
        const { valorPatrimonialPresente, valorPredial } = cuota;

        const mesResult = {
          Mes: new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(mes),
          Anio: anio,
          ValorPatrimonial: mesNum === 1 ? valorPatrimonialPresente * 0.5 : null, // Febrero (50% de descuento)
          ValorPredial: mesNum === 10 ? valorPredial * 0.5 : null, // Noviembre (50% de descuento)
        };

        // Solo agregar al total y al resultado si tiene algo que pagar en ese mes
        if (mesResult.ValorPatrimonial || mesResult.ValorPredial) {
          if (mesNum === 1) totalAPagar += (valorPatrimonialPresente || 0) * 0.5; // Febrero
          if (mesNum === 10) totalAPagar += (valorPredial || 0) * 0.5; // Noviembre

          resultado.push(mesResult); // Solo se añade si debe pagar algo
        }
      }
    }

    // Responder solo con los meses que tienen pagos y el total acumulado
    res.status(200).json({ res: 'Detalles de pagos:', data: resultado, TotalAPagar: totalAPagar });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error interno del servidor" });
  }
};
