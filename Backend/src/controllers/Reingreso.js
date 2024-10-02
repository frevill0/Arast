import { PrismaClient } from "@prisma/client";
import { getYear, getMonth, format, addYears } from 'date-fns';
import { es } from 'date-fns/locale';

const prisma = new PrismaClient(); 

// Función auxiliar para formatear las fechas 
const formatoFecha = (dateString) => {
    if (!dateString) return null;
  
    const date = new Date(dateString);
  
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
  
    return `${day}/${month}/${year}`;
  }

// Función para calcular el valor mensual según el mes
function calcularValorMensual(mes, anio, valorCuotaPresente, valorPatrimonialPresente, valorPatrimonialAnterior, valorPredial) {
  let valorMensual = valorCuotaPresente; // Cobro mensual por defecto de las cuotas 

  // En enero (mes 0), se cobra el valor patrimonial del año anterior
  if (mes === 0) {
      valorMensual += valorPatrimonialAnterior / 12; // Cobro patrimonial del año anterior dividido en 12
  } else if (mes >= 1) { // A partir de febrero se cobra el valor patrimonial del año actual
      valorMensual += valorPatrimonialPresente / 12;
  }

  // Cobro fijo de 182 dólares en julio de 2022
  if (mes === 6 && anio === 2022) { // Julio es el mes 6
      valorMensual += 182;
  }

  // Cobro adicional en noviembre (predial)
  if (mes === 10) { // Noviembre es el mes 10
      valorMensual += valorPredial;
  }

  return valorMensual;
}

  export const ConsultaReingreso = async (req, res) => {
    const membresia = req.params.Membresia;  
    console.log("Membresía recibida:", membresia);
  
    if (!membresia) {
      return res.status(400).send({ msg: "Esa no es una membresía válida" });
    }
  
    try {
      // Encontrar al socio basado en la membresía
      const encontrarSocio = await prisma.contactscm_fac_elec_arast.findUnique({
        where: {
          Membresia: membresia,
        },
      });
  
      if (!encontrarSocio) {
        return res.status(400).send({ msg: "No se encontró un socio con esa membresía" });
      }
  
      // Validar que el estatus del socio sea uno de los permitidos
      const estatusPermitidos = ["Separado", "Juv. Perdio Derecho", "Retirado"];
      if (!estatusPermitidos.includes(encontrarSocio.Estatus)) {
        return res.status(400).send({ msg: "El socio no está en un estado válido para reingreso" });
      }
  
      // Buscar el estado anterior en la vista
      const estadoAnterior = await prisma.vw_estado_anterior_susp_temporal.findFirst({
        where: {
          membresia: membresia,
        },
      });
  
      if (!estadoAnterior) {
        return res.status(400).send({ msg: "No se encontró el estado anterior para esa membresía" });
      }
  
      // Fecha actual (para la liquidación)
      const fechaActual = new Date();
  
      const resultado = {
        Socio: encontrarSocio.Socio,
        Categoria: encontrarSocio.Categoria,  
        Titular: encontrarSocio.Titular,     
        Estatus: encontrarSocio.Estatus,
        FechaNacimiento: formatoFecha(encontrarSocio.FechaNac),
        Edad: encontrarSocio.Edad,
        FechaRetSep: formatoFecha(encontrarSocio.fechaRetSep), 
        EstadoAnterior: estadoAnterior.estadoAnterior,
        FechaFinalLiquidacion: formatoFecha(fechaActual),  
        EstadoProceso: "Abierto", 
      };
  
      res.status(200).json({ res: 'Detalles del socio y reingreso:', data: resultado });
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "Error interno del servidor" });
    }
  };
  
  export const consultaPagoReingreso = async (req, res) => {
    try {
        const membresia = req.params.Membresia;
        console.log("Membresía recibida:", membresia);

        // Paso 1: Buscar al socio por su membresía
        const socio = await prisma.contactscm_fac_elec_arast.findUnique({
            where: {
                Membresia: membresia,
                Estatus: {
                    in: ["Separado", "Juv. Perdio Derecho", "Retirado"]
                }
            }
        });

        if (!socio) {
            return res.status(404).json({ message: 'Socio no encontrado o en estado inválido' });
        }

        let categoria = socio.Categoria;
        const fechaCumple27 = addYears(new Date(socio.FechaNac), 27);
        const fechaCumple22 = addYears(new Date(socio.FechaNac), 22);
        const fecha21Sept2021 = new Date(2021, 8, 21);
        let fechaInicioCobro = new Date(socio.fechaRetSep);
        fechaInicioCobro.setMonth(fechaInicioCobro.getMonth() + 2)
        console.log (fechaInicioCobro)

        if (categoria === "Juvenil") {
            if (fechaCumple27 >= fecha21Sept2021) {
                fechaInicioCobro = fechaCumple27;
                fechaInicioCobro.setMonth(fechaInicioCobro.getMonth() + 1);
                console.log(fechaInicioCobro)
                categoria = "Activo >= 27";
            } else {
                fechaInicioCobro = fechaCumple22;
                fechaInicioCobro.setMonth(fechaInicioCobro.getMonth() + 2);
                console.log(fechaInicioCobro)
                categoria = "Activo < 27";
            }
        }

        const fechaActual = new Date();
        const listaAnios = [];
        let totalFinal = 0;
        let totalCuota = 0;
        let totalPatrimonial = 0;
        let totalPredial = 0;

        for (let anio = getYear(fechaInicioCobro); anio <= getYear(fechaActual); anio++) {
            let meses = [];
            let totalAnual = 0;

            for (let mes = (anio === getYear(fechaInicioCobro)) ? getMonth(fechaInicioCobro) : 0; 
                 mes < ((anio === getYear(fechaActual)) ? getMonth(fechaActual) + 1 : 12); 
                 mes++) {
                 
                let categoriaMensual = categoria;
                const mesNombre = format(new Date(anio, mes), 'MMMM', { locale: es });

                if (anio > getYear(fechaCumple27) || (anio === getYear(fechaCumple27) && mes >= getMonth(fechaCumple27))) {
                    categoriaMensual = "Activo >= 27";
                }

                const cuota = await prisma.cuota.findFirst({
                    where: {
                        categoria: categoriaMensual,
                        anio
                    },
                    select: {
                        valorCuotaPresente: true,
                        valorPatrimonialPresente: true,
                        valorPredial: true
                    }
                });

                if (!cuota) {
                    return res.status(404).json({ message: `Cuota no encontrada para la categoría ${categoriaMensual} en el año ${anio}` });
                }

                const cuotaAnterior = await prisma.cuota.findFirst({
                    where: {
                        categoria: categoriaMensual,
                        anio: anio - 1
                    },
                    select: {
                        valorPatrimonialPresente: true
                    }
                });

                const { valorCuotaPresente, valorPatrimonialPresente, valorPredial } = cuota;
                const valorPatrimonialAnterior = cuotaAnterior ? cuotaAnterior.valorPatrimonialPresente : 0;

                const valorMensual = calcularValorMensual(mes, anio, valorCuotaPresente, valorPatrimonialPresente, valorPatrimonialAnterior, valorPredial);
                totalAnual += valorMensual;
                totalCuota += valorCuotaPresente;

                // Sumamos patrimonial y predial solo en los meses que se cobran
                if (mes === 0) { // Supongamos que solo se cobran en enero
                    totalPatrimonial += valorPatrimonialPresente;
                    totalPredial += valorPredial;
                }

                meses.push({ mes: mesNombre, categoria: categoriaMensual, valor: valorMensual });
            }

            totalFinal += totalAnual;

            listaAnios.push({
                anio,
                meses,
                totalAnual
            });
        }

        return res.json({
            anios: listaAnios,
            totalFinal,
            totalCuota,
            totalPatrimonial,
            totalPredial
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};
