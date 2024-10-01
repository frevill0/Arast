import { PrismaClient } from "@prisma/client";
import { getYear, getMonth, format, addYears } from 'date-fns';
import { es } from 'date-fns/locale';

const prisma = new PrismaClient(); 

const formatoFecha = (dateString) => {
    if (!dateString) return null;
  
    const date = new Date(dateString);
  
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
  
    return `${day}/${month}/${year}`;
  }

  // Función para calcular el valor mensual según el mes
  function calcularValorMensual(mes, valorCuotaPresente, valorPatrimonialPresente, valorPredial) {
    let valorMensual = valorCuotaPresente; // Cobro mensual por defecto
    if (mes === 1) {
        valorMensual += valorPatrimonialPresente; // Cobro adicional en febrero
    } else if (mes === 10) {
        valorMensual += valorPredial; // Cobro adicional en noviembre
    }
    return valorMensual;
}


// Función auxiliar para calcular la edad del socio
const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
};

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
        EstadoActual: "hola",
        EstadoAnterior: "hola",
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
        const fechaCumple27 = addYears(new Date(socio.FechaNac), 27); // Calculamos la fecha del cumpleaños 27
        const fecha21Sept2021 = new Date(2021, 8, 21); // 21 de septiembre de 2021
        let fechaInicioCobro = new Date(socio.fechaRetSep); // Por defecto es la fecha de retiro

        // Paso 2: Verificar si el socio es juvenil y maneja la fecha de cumpleaños 27
        if (categoria === "Juvenil") {
            if (fechaCumple27 >= fecha21Sept2021) {
                // Si cumple 27 después del 21 de septiembre de 2021, tomamos su cumpleaños 27 como fechaRetSep
                fechaInicioCobro = fechaCumple27;
                categoria = "Activo >= 27";
            } else {
                // Si cumple antes o en esa fecha, cambiar la categoría al cumplir 27
                fechaInicioCobro = new Date(socio.fechaRetSep); // Usamos fechaRetSep original
                categoria = "Activo < 27";
            }
        }

        const fechaActual = new Date();
        const listaAnios = [];
        let totalFinal = 0;

        // Generar los años desde la fecha de retiro o cumpleaños 27 hasta el año actual
        for (let anio = getYear(fechaInicioCobro); anio <= getYear(fechaActual); anio++) {
            let meses = [];
            let totalAnual = 0;

            const cumpleEnEsteAnio = getYear(fechaCumple27) === anio; // ¿Cumple 27 este año?

            for (let mes = (anio === getYear(fechaInicioCobro)) ? getMonth(fechaInicioCobro) : 0; 
                 mes < ((anio === getYear(fechaActual)) ? getMonth(fechaActual) + 1 : 12); 
                 mes++) {
                 
                let categoriaMensual = categoria; // Categoría inicial
                const mesNombre = format(new Date(anio, mes), 'MMMM', { locale: es }); // Mes en español

                // Cambiar a "Activo >= 27" si el socio ya ha cumplido 27 en este año o en un año anterior
                if (anio > getYear(fechaCumple27) || (anio === getYear(fechaCumple27) && mes >= getMonth(fechaCumple27))) {
                    categoriaMensual = "Activo >= 27";
                }

                // Buscar las cuotas según la categoría y el año
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

                const { valorCuotaPresente, valorPatrimonialPresente, valorPredial } = cuota;
                const valorMensual = calcularValorMensual(mes, valorCuotaPresente, valorPatrimonialPresente, valorPredial);
                totalAnual += valorMensual;
                meses.push({ mes: mesNombre, categoria: categoriaMensual, valor: valorMensual });
            }

            totalFinal += totalAnual;

            // Agregar el total anual y los meses correspondientes al año
            listaAnios.push({
                anio,
                meses,
                totalAnual
            });
        }

        // Devolver la lista de años con los meses y el total final
        return res.json({
            anios: listaAnios,
            totalFinal
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};
