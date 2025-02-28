import { PrismaClient } from "@prisma/client";
import { getYear, getMonth, format, addYears, parse } from 'date-fns';
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
function calcularValorMensual(mes, anio, valorCuotaPresente, valorPatrimonialPresente, valorPatrimonialAnterior, valorPredial, valorPredialAnterior, fechaEntrada, categoria, tipoCobro, fechaCumple27, fechaInicioCobro) {
  let valorMensual = valorCuotaPresente; // Cobro mensual por defecto de las cuotas
  let valorPatrimonial = 0;
  let valorPredialMensual = 0;

  const fechaActual = new Date();
  const anioActual = fechaActual.getFullYear();
  const mesActual = fechaActual.getMonth(); // Obtener el mes actual (0 para enero, 11 para diciembre)

  const anioEntrada = fechaEntrada.getFullYear();

  // Si la fecha de inicio de cobro es en enero, no se debe cobrar patrimonial en enero
  if (anio === getYear(fechaEntrada) && mes === 0) {
    valorPatrimonial = 0; // No cobrar patrimonial en enero
  } else {
    // Condición especial para el año actual
    if (anio === anioActual) {
      if (mes === 0) { // Si es enero del año actual
        valorPatrimonial = valorPatrimonialAnterior / 12; // Cobrar la parte restante del patrimonial del año anterior
      } else if (mes === mesActual) { // Si es el mes actual (excepto enero)
        valorPatrimonial = valorPatrimonialPresente/12; // Cobrar todo el valor patrimonial del año actual
      } else {
        valorPatrimonial = 0; // No se cobra patrimonial en los demás meses del año actual
      }
    } else {
      // Si no es el año actual y el tipo de cobro es "juvenil", no cobrar después de septiembre de 2021
      if (mes === 0) { // En enero de años anteriores
        valorPatrimonial = valorPatrimonialAnterior / 12; // Cobro patrimonial del año anterior dividido en 12
      } else if (mes >= 1) { // A partir de febrero se cobra el valor patrimonial del año actual
        valorPatrimonial = valorPatrimonialPresente / 12;
      }
    }
  }
  

  // Cobro fijo de 182 dólares en noviembre de 2022
  if (mes === 10 && anio === 2022) { // Noviembre es el mes 10
    if (categoria === "Activo >= 27") {
      valorPatrimonial += 182;
    } else if (categoria === "Especial x Propios D") {
      valorPatrimonial += 105;
    } else if (categoria === "Especial Viudo") {
      valorPatrimonial += 105;
    } else if (categoria === "Vitalicio") {
      valorPatrimonial += 38.5;
    } else if (categoria === "Corresponsal") {
      valorPatrimonial += 182;
    }
  }

  // Cobro adicional en noviembre (predial)
  if (anio === anioActual) {
    if (mes < 10) {
      valorPredialMensual = valorPredialAnterior / 12; // Cobrar la parte restante del predial del año anterior
    } else if (mes >= 10) {
      valorPredialMensual = valorPredial/12; // Cobrar todo el valor predial del año actual
    } else {
      valorPredialMensual = 0; // No se cobra predial en los demás meses del año actual
    }
  } else if (anio === anioEntrada) {
    if (mes >= 10) {
      valorPredialMensual = valorPredial / 12;
    }
  } else {
    if (mes < 10) { // En meses antes de noviembre de años anteriores
      valorPredialMensual = valorPredialAnterior / 12; // Cobro del año anterior dividido en 12
    } else if (mes >= 10) { // A partir de noviembre se cobra el valor del año actual
      valorPredialMensual = valorPredial / 12;
    }
  }

  if (anio === 2021 && mes >= 9 && tipoCobro === "Juvenil" && categoria == "Activo < 27") {
    valorPatrimonial = 0; // No se cobra patrimonial después de septiembre de 2021
  } 
  if (anio >= 2022 && mes == 0 && tipoCobro === "Juvenil" && categoria == "Activo < 27") {
    valorPatrimonial = 0; // No se cobra patrimonial después de septiembre de 2021
  } 
  const fecha1OCT2021 = new Date(2021, 9, 1);
  if (anio === 2022 && mes == 0  && tipoCobro === "Juvenil" && categoria === "Activo >= 27" && fechaCumple27 > fecha1OCT2021){
    valorPatrimonial = 0; 
  }


  // Aplicar la misma condición para el predial si el tipo de cobro es "juvenil"
  if (anio === 2021 && mes >= 9 && tipoCobro === "Juvenil" && categoria === "Activo < 27") {
    valorPredialMensual = 0; // No se cobra predial después de septiembre de 2021
  }
  if (anio >= 2022 && mes >= 0 && tipoCobro === "Juvenil" && categoria === "Activo < 27") {
    valorPredialMensual = 0; 
  }
  const fecha1Nov2021 = new Date(2021, 10, 1);
  if (anio === 2022 && mes >= 0 && mes <= 9 && tipoCobro === "Juvenil" && categoria === "Activo >= 27" && fechaCumple27 > fecha1Nov2021){
    valorPredialMensual = 0; 
  }

  // Suma total del mes
  valorMensual += valorPatrimonial + valorPredialMensual;

  return {
    valorMensual,
    valorPatrimonial,
    valorPredial: valorPredialMensual
  };
}



const obtenerFechaActual = () => {
  const fecha = new Date();
  // Asegúrate de obtener solo la parte de la fecha sin la hora
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
};

export const ConsultaReingreso = async (req, res) => {
  const membresia = req.params.Membresia;  

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
    const estatusPermitidos = ["Juv. Perdio Derecho", "Retirado", "Juv.No Tiene Derecho"];
    if (!estatusPermitidos.includes(encontrarSocio.Estatus)) {
      console.log(encontrarSocio.Estatus);
      return res.status(400).send({ msg: "El socio no está en un estado válido para reingreso" });
    }

    const fechaActual = obtenerFechaActual();

    const resultado = {
      Socio: encontrarSocio.Socio,
      Categoria: encontrarSocio.Categoria, 
      Titular: encontrarSocio.Titular, 
      Estatus: encontrarSocio.Estatus,
      FechaNacimiento: formatoFecha(encontrarSocio.FechaNac),
      Edad: encontrarSocio.Edad,
      FechaFinalLiquidacion: formatoFecha(fechaActual),
    };

    res.status(200).json({ res: 'Detalles del socio y reingreso:', data: resultado });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error interno del servidor" });
  }
};
 
export const consultaPagoReingreso = async (req, res) => {
  try {
      const { Membresia } = req.params;
      const { fechaInicioCobroInput, tipoCobro } = req.body;

      if (!tipoCobro || !fechaInicioCobroInput) {
          return res.status(400).json({ message: 'Tipo de Cobro y Fecha de Inicio de Cobro son obligatorios' });
      }

      // Convertir la fecha de formato yyyy-MM-dd a un objeto Date
      let fechaInicioCobro = parse(fechaInicioCobroInput, 'yyyy-MM-dd', new Date(), { locale: es });

      if (isNaN(fechaInicioCobro.getTime())) {
          return res.status(400).json({ message: 'Formato de fecha inválido. Utilice yyyy-MM-dd' });
      }

      // Buscar al socio con el estado correspondiente
      const socio = await prisma.contactscm_fac_elec_arast.findUnique({
          where: {
              Membresia: Membresia,
              Estatus: {
                  in: ["Juv. Perdio Derecho", "Retirado", "Juv.No Tiene Derecho"]
              }
          }
      });

      if (!socio) {
          return res.status(404).json({ message: 'Socio no encontrado o en estado inválido' });
      }

      let categoria = socio.Categoria;
      let fechaCumple27 = addYears(new Date(socio.FechaNac), 27);
      let fechaCumple22 = addYears(new Date(socio.FechaNac), 22);
      let fecha21Sept2021 = new Date(2022, 10, 1);

      fechaCumple27.setMonth(fechaCumple27.getMonth() + 1);
      fechaCumple22.setMonth(fechaCumple22.getMonth() + 1);

      // Ajustar la fecha de inicio de cobro y categoría según condiciones
      if (tipoCobro !== "Retirado") {
          if (fechaCumple27 >= fecha21Sept2021) {
              fechaInicioCobro = fechaCumple27;
              categoria = "Activo >= 27";
          } else if (categoria === "Activo >= 26" || fechaCumple27 < fecha21Sept2021) {
              categoria = fechaCumple27 < fecha21Sept2021 ? "Activo < 27" : "Activo >= 27";
              fechaInicioCobro = fechaCumple22;
          }
      }else if (tipoCobro == "Retirado"){
        if (categoria === "Activo >= 26" ) {
              categoria = "Activo >= 27"
            }
      }

      const fechaActual = new Date();
      const listaAnios = [];
      let totalCuota = 0;
      let totalPatrimonial = 0;
      let totalPredial = 0;

      // Bucle para calcular año por año
      for (let anio = getYear(fechaInicioCobro); anio <= getYear(fechaActual); anio++) {
          let meses = [];
          let totalAnual = 0;
          let totalCuotaAnual = 0;
          let totalPatrimonialAnual = 0;
          let totalPredialAnual = 0;
          let categoriasAnuales = new Set(); // Para evitar categorías duplicadas

          for (let mes = (anio === getYear(fechaInicioCobro)) ? getMonth(fechaInicioCobro) : 0;
              mes < ((anio === getYear(fechaActual)) ? getMonth(fechaActual) + 1 : 12);
              mes++) {

              let categoriaMensual = categoria;
              if (anio > getYear(fechaCumple27) || (anio === getYear(fechaCumple27) && mes >= getMonth(fechaCumple27))) {
                  categoriaMensual = tipoCobro === "Juvenil" ? "Activo >= 27" : categoriaMensual;
              }
              categoriasAnuales.add(categoriaMensual); // Agregar la categoría mensual

              // Consultar las cuotas del año
              const cuota = await prisma.cuota.findFirst({
                  where: { categoria: categoriaMensual, anio },
                  select: { valorCuotaPresente: true, valorPatrimonialPresente: true, valorPredial: true }
              });

              if (!cuota) {
                  return res.status(404).json({ message: `Cuota no encontrada para la categoría ${categoriaMensual} en el año ${anio}` });
              }

              // Consultar la cuota anterior para patrimonial y predial
              const cuotaAnterior = await prisma.cuota.findFirst({
                  where: { categoria: categoriaMensual, anio: anio - 1 },
                  select: { valorPatrimonialPresente: true, valorPredial: true }
              });

              const valorPatrimonialAnterior = cuotaAnterior?.valorPatrimonialPresente || 0;
              const valorPredialAnterior = cuotaAnterior?.valorPredial || 0;

              // Calcular valores mensuales
              const { valorMensual, valorPatrimonial, valorPredial: valorPredialMensual } = calcularValorMensual(
                  mes, anio, cuota.valorCuotaPresente, cuota.valorPatrimonialPresente,
                  valorPatrimonialAnterior, cuota.valorPredial, valorPredialAnterior,
                  fechaInicioCobro, categoriaMensual, tipoCobro, fechaCumple27
              );

              totalAnual += valorMensual;
              totalCuotaAnual += cuota.valorCuotaPresente;
              totalPatrimonialAnual += valorPatrimonial;
              totalPredialAnual += valorPredialMensual;

              totalCuota += cuota.valorCuotaPresente;
              totalPatrimonial += valorPatrimonial;
              totalPredial += valorPredialMensual;

              meses.push({ mes: format(new Date(anio, mes), 'MMMM', { locale: es }), categoria: categoriaMensual, valor: valorMensual });
          }

          listaAnios.push({
              anio,
              meses,
              totalAnual,
              totalCuotaAnual,
              totalPatrimonialAnual,
              totalPredialAnual,
              categoriasAnuales: Array.from(categoriasAnuales)
          });
      }

      let recategorizacion = tipoCobro === "Juvenil" ? 8000 : 0
      let total = totalCuota + totalPatrimonial + totalPredial;
      let descuento = total/2;
      let totalFinal = tipoCobro === "Juvenil" ? descuento + recategorizacion : descuento;  

      return res.json({
          anios: listaAnios,
          total,
          totalFinal,
          totalCuota,
          totalPatrimonial,
          totalPredial,
          amnistia : descuento,
          recategorizacion
      });

  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error en el servidor' });
  }
};



