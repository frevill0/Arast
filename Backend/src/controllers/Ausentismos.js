
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

    const Titular = encontrarSocio.Relacion
    if(Titular !== "Titular"){
      return res.status(400).send({msg : "El socio que esta buscando no es titular"})
    }

    const estadosAusentes = ['Ausente', 'Ausente > 26', 'Ausente > 27'];
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
      FechaAusentismo: formatoFecha(encontrarSocio.Marca_Ausentes)
    }

    res.status(200).json({ res: 'Detalles del socio: ', data: resultado });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error interno del servidor" });
  }
};

export const RegistroMigratorio = async (req, res) => {
  try {
    const { membresia, fechaSalida, fechaEntrada } = req.body;

    if (!fechaSalida || !fechaEntrada || !membresia) {
      return res.status(400).json({ msg: "Las fechas de salida, entrada y la membresía son requeridas" });
    }

    const parseDate = (fecha) => {
      const [day, month, year] = fecha.split("/");
      return new Date(`${year}-${month}-${day}`);
    };

    const salida = parseDate(fechaSalida);
    const entrada = parseDate(fechaEntrada);

    if (isNaN(salida.getTime()) || isNaN(entrada.getTime())) {
      return res.status(400).json({ msg: "Las fechas proporcionadas no son válidas" });
    }

    if (salida > entrada) {
      return res.status(400).json({ msg: "La fecha de salida no puede ser mayor que la fecha de entrada" });
    }

    const socioData = await prisma.contactscm_fac_elec_arast.findUnique({
      where: { Membresia: membresia },  
    });

    const membresiaInt = parseInt(membresia, 10);

    if (!socioData) {
      return res.status(404).json({ msg: "No se encontró un socio con esa membresía" });
    }

    const fechaAusentismo = socioData.Marca_Ausentes ? new Date(socioData.Marca_Ausentes) : null;

    if (fechaAusentismo && isNaN(fechaAusentismo.getTime())) {
      return res.status(400).json({ msg: "La fecha de ausentismo no es válida" });
    }

    const registrosExistentes = await prisma.registroMovMigracion.findMany({
      where: { membresia: membresiaInt },
      orderBy: { fechaEntreda: 'asc' }
    });

    for (const registro of registrosExistentes) {
      const registroSalida = new Date(registro.fechaSalida);
      const registroEntrada = new Date(registro.fechaEntreda);

      if (
        (salida < registroEntrada && entrada > registroSalida) || 
        (salida <= registroEntrada && entrada > registroEntrada) || 
        (salida < registroSalida && entrada >= registroSalida) 
      ) {
        return res.status(400).json({ msg: "El rango de fechas se solapa con un registro existente" });
      }
    }

    let diasEnPais = 0;
    let diasExterior = 0;
    
    if (registrosExistentes.length > 0) {
      const ultimaFechaEntrada = new Date(registrosExistentes[registrosExistentes.length - 1].fechaEntreda);
      diasEnPais = Math.floor((salida - ultimaFechaEntrada) / (1000 * 60 * 60 * 24));
    } else {
      diasEnPais = 0;

      const fechaComparar = fechaAusentismo ? fechaAusentismo : salida;
      diasExterior = Math.floor((entrada - fechaComparar) / (1000 * 60 * 60 * 24));
    }
    
    if (registrosExistentes.length > 0) {
      diasExterior = Math.floor((entrada - salida) / (1000 * 60 * 60 * 24));
    }

    const nuevoRegistro = await prisma.registroMovMigracion.create({
      data: {
        socio: socioData.Socio,  
        membresia: membresiaInt,
        fechaAusentismo: fechaAusentismo,  
        fechaSalida: salida,
        fechaEntreda: entrada,
        exterior: diasExterior >= 0 ? diasExterior : 0,  
        pais: diasEnPais >= 0 ? diasEnPais : 0,  
        estadoMigratorio: "Abierto",  
        categoriaSocio: socioData.Categoria,  
        estadoSocio: socioData.Estatus,  
        comentario: "N/A",  
        valorAdicional: 0,  
        descripcionValor: "N/A"
      }
    });

    res.status(201).json({ msg: "Registro creado con éxito", data: nuevoRegistro });
  } catch (error) {
    console.error("Error al crear el registro migratorio:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};


export const verRegistrosMigratoriosPorMembresia = async (req, res) => {
  try {
    const membresia = req.params.membresia;

    if (!membresia) {
      return res.status(400).json({ msg: "La membresía es requerida" });
    }

    const membresiaInt = parseInt(membresia, 10);

    if (isNaN(membresiaInt)) {
      return res.status(400).json({ msg: "La membresía debe ser un número válido" });
    }

    const registros = await prisma.registroMovMigracion.findMany({
      where: {
        membresia: membresiaInt,
        estadoMigratorio: "Abierto", 
      },
      orderBy: {
        fechaEntreda: 'asc',
      },
    });

    if (registros.length === 0) {
      return res.status(404).json({ msg: "No se encontraron registros migratorios abiertos para esta membresía" });
    }

    const resultado = registros.map((registro) => ({
      socio: registro.socio,
      membresia: registro.membresia,
      fechaAusentismo: formatoFecha(registro.fechaAusentismo),
      fechaSalida: formatoFecha(registro.fechaSalida),
      fechaEntreda: formatoFecha(registro.fechaEntreda),
      exterior: registro.exterior,
      pais: registro.pais,
      estadoMigratorio: registro.estadoMigratorio,
      categoriaSocio: registro.categoriaSocio,
      estadoSocio: registro.estadoSocio,
      comentario: registro.comentario,
      valorAdicional: registro.valorAdicional,
      descripcionValor: registro.descripcionValor,
    }));

    res.status(200).json({ msg: "Registros migratorios abiertos encontrados", data: resultado });
  } catch (error) {
    console.error("Error al obtener los registros migratorios:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const consultaPagoAusentismoCuota = async (req, res) => {
  try {
    const membresia = req.params.membresia;

    if (!membresia) {
      return res.status(400).json({ msg: "La membresía es requerida" });
    }

    const membresiaInt = parseInt(membresia, 10);

    if (isNaN(membresiaInt)) {
      return res.status(400).json({ msg: "La membresía debe ser un número válido" });
    }

    const registros = await prisma.registroMovMigracion.findMany({
      where: {
        membresia: membresiaInt,
        estadoMigratorio: "Abierto",
      },
      orderBy: {
        fechaSalida: 'asc',
      },
    });

    if (registros.length === 0) {
      return res.status(404).json({ msg: "No se encontraron registros migratorios abiertos para esta membresía" });
    }

    const socioData = await prisma.contactscm_fac_elec_arast.findUnique({
      where: { Membresia: membresia },
    });

    if (!socioData) {
      return res.status(404).json({ msg: "No se encontró un socio con esa membresía" });
    }

    let periodos = [];
    let fechaInicioPeriodo = registros[0].fechaSalida;
    let fechaFinPeriodo = new Date(fechaInicioPeriodo);
    fechaFinPeriodo.setFullYear(fechaFinPeriodo.getFullYear() + 1);

    while (fechaInicioPeriodo < registros[registros.length - 1].fechaSalida) {
      const periodoRegistros = registros.filter((registro) => {
        return (registro.fechaSalida >= fechaInicioPeriodo && registro.fechaSalida < fechaFinPeriodo) ||
               (registro.fechaSalida < fechaInicioPeriodo && registro.fechaEntreda >= fechaInicioPeriodo && registro.fechaEntreda < fechaFinPeriodo) ||
               (registro.fechaSalida >= fechaInicioPeriodo && registro.fechaSalida < fechaFinPeriodo && registro.fechaEntreda >= fechaFinPeriodo);
      });

      let mesesAPagar = [];
      let diasFueraPaisTotal = 0;
      let diasDentroPaisTotal = 0;

      for (let mes = 0; mes < 12; mes++) {
        const fechaMes = new Date(fechaInicioPeriodo);
        fechaMes.setMonth(fechaMes.getMonth() + mes);

        const inicioMes = new Date(fechaMes.getFullYear(), fechaMes.getMonth(), 1);
        const finMes = new Date(fechaMes.getFullYear(), fechaMes.getMonth() + 1, 0);

        let diasFueraMes = 0;
        let diasDentroMes = 0;

        periodoRegistros.forEach(registro => {
          let inicioPeriodo = registro.fechaSalida > fechaInicioPeriodo ? registro.fechaSalida : fechaInicioPeriodo;
          let finPeriodo = registro.fechaEntreda < fechaFinPeriodo ? registro.fechaEntreda : fechaFinPeriodo;

          const inicioInterseccion = new Date(Math.max(inicioMes.getTime(), inicioPeriodo.getTime()));
          const finInterseccion = new Date(Math.min(finMes.getTime(), finPeriodo.getTime()));

          if (inicioInterseccion < finInterseccion) {
            const diasInterseccion = (finInterseccion - inicioInterseccion) / (1000 * 60 * 60 * 24) + 1; // +1 para incluir el último día
            diasFueraMes += diasInterseccion;
          }
        });

        diasDentroMes = (finMes - inicioMes) / (1000 * 60 * 60 * 24) + 1 - diasFueraMes; // Total días en el mes - Días fuera del país
        diasFueraPaisTotal += diasFueraMes;
        diasDentroPaisTotal += diasDentroMes;

        const cuota = await prisma.cuota.findFirst({
          where: {
            categoria: socioData.Categoria,
            anio: fechaMes.getFullYear(),
          },
        });

        if (!cuota) {
          return res.status(404).json({ msg: `No se encontró una cuota para la categoría ${socioData.Categoria} y el año ${fechaMes.getFullYear()}` });
        }

        const cuotaPresente = cuota.valorCuotaPresente;
        const cuotaAusente = cuota.valorCuotaAusente;
        let diferencia = 0;

        // Calcula la diferencia de acuerdo al total de días fuera del país del periodo
        if (diasFueraPaisTotal >= 180) {
          diferencia = 0;
        } else {
          diferencia = cuotaPresente - cuotaAusente;
        }

        mesesAPagar.push({
          mes: fechaMes.toLocaleDateString("es-ES", { month: "long", year: "numeric" }),
          diasFueraMes: diasFueraMes,
          diasDentroMes: diasDentroMes,
          cuotaAusente: cuotaAusente,
          cuotaPresente: cuotaPresente,
          diferencia: diferencia,
        });
      }

      // Verifica si el total de días fuera del país supera los 180 días y ajusta el totalPagar
      const totalPagar = diasFueraPaisTotal >= 180 ? 0 : mesesAPagar.reduce((sum, mes) => sum + mes.diferencia, 0);

      periodos.push({
        periodo: `${fechaInicioPeriodo.getFullYear()}-${fechaFinPeriodo.getFullYear()}`,
        mesesAPagar: mesesAPagar,
        totalPagar: totalPagar,
        totalDiasFueraPais: diasFueraPaisTotal,
        totalDiasDentroPais: diasDentroPaisTotal,
      });

      fechaInicioPeriodo = new Date(fechaFinPeriodo);
      fechaFinPeriodo.setFullYear(fechaFinPeriodo.getFullYear() + 1);
    }

    res.status(200).json({ msg: "Consulta de pago de ausentismo completada", data: periodos });
  } catch (error) {
    console.error("Error en la consulta de pago de ausentismo:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};







