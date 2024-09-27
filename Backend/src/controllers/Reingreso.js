import { PrismaClient } from "@prisma/client";
import { getYear, getMonth, format } from 'date-fns';
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

  // Función auxiliar para calcular el valor mensual
  const calcularValorMensual = (mes, valorCuotaPresente, valorPatrimonialPresente, valorPredial) => {
    let total = valorCuotaPresente; // Se cobra cada mes
    if (mes === 1) { // Febrero (mes indexado en 0, por eso febrero es el 1)
        total += valorPatrimonialPresente;
    }
    if (mes === 10) { // Noviembre (mes indexado en 0, por eso noviembre es el 10)
        total += valorPredial;
    }
    return total;
};

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
      //const estadoAnterior = await prisma.vw_estado_anterior_susp_temporal.findFirst({
        //where: {
          //membresia: membresia,
        //},
      //});
  
      //if (!estadoAnterior) {
        //return res.status(400).send({ msg: "No se encontró el estado anterior para esa membresía" });
      //}
  
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

        // Paso 2: Buscar la categoría del socio en la misma tabla contactscm_fac_elec_arast
        let categoria = socio.Categoria;

        if (categoria === "Activo >= 26") {
            categoria = "Activo >= 27";
        }

        console.log(categoria);

        // Si la categoría es "Juvenil", cambiarla a "Activo >= 27"
        if (categoria === "Juvenil") {
            const edad = calcularEdad(socio.FechaNac); // Asumiendo que tienes una columna de fechaNacimiento
            if (edad >= 27) {
                categoria = "Activo >= 27";
            }
        }

        const fechaRetSep = new Date(socio.fechaRetSep);
        const fechaActual = new Date();

        const listaAnios = [];
        let totalFinal = 0;

        // Generar los años desde la fecha de retiro hasta el año actual
        for (let anio = getYear(fechaRetSep); anio <= getYear(fechaActual); anio++) {
            
            // Paso 3: Buscar los valores en la tabla Cuota por categoría y año
            const cuota = await prisma.cuota.findFirst({
                where: {
                    categoria,
                    anio
                },
                select: {
                    valorCuotaPresente: true,
                    valorPatrimonialPresente: true,
                    valorPredial: true
                }
            });

            if (!cuota) {
                return res.status(404).json({ message: `Cuota no encontrada para la categoría ${categoria} en el año ${anio}` });
            }

            const { valorCuotaPresente, valorPatrimonialPresente, valorPredial } = cuota;

            let meses = [];
            let totalAnual = 0;

            if (anio === getYear(fechaRetSep)) {
                // Si es el año de retiro, empezar desde el mes de retiro
                for (let mes = getMonth(fechaRetSep); mes < 12; mes++) {
                    const mesNombre = format(new Date(anio, mes), 'MMMM', { locale: es }); // Mes en español
                    const valorMensual = calcularValorMensual(mes, valorCuotaPresente, valorPatrimonialPresente, valorPredial);
                    totalAnual += valorMensual;
                    meses.push({ mes: mesNombre, valor: valorMensual });
                }
            } else if (anio === getYear(fechaActual)) {
                // Si es el año actual, calcular hasta el mes actual
                for (let mes = 0; mes <= getMonth(fechaActual); mes++) {
                    const mesNombre = format(new Date(anio, mes), 'MMMM', { locale: es }); // Mes en español
                    const valorMensual = calcularValorMensual(mes, valorCuotaPresente, valorPatrimonialPresente, valorPredial);
                    totalAnual += valorMensual;
                    meses.push({ mes: mesNombre, valor: valorMensual });
                }
            } else {
                // Años intermedios, agregar todos los meses
                for (let mes = 0; mes < 12; mes++) {
                    const mesNombre = format(new Date(anio, mes), 'MMMM', { locale: es }); // Mes en español
                    const valorMensual = calcularValorMensual(mes, valorCuotaPresente, valorPatrimonialPresente, valorPredial);
                    totalAnual += valorMensual;
                    meses.push({ mes: mesNombre, valor: valorMensual });
                }
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
  

  

  
  
  
  