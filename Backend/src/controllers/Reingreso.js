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
function calcularValorMensual(mes, anio, valorCuotaPresente, valorPatrimonialPresente, valorPatrimonialAnterior, valorPredial, valorPredialAnterior,fechaEntrada) {
  let valorMensual = valorCuotaPresente; // Cobro mensual por defecto de las cuotas
  let valorPatrimonial = 0;
  let valorPredialMensual = 0;

  const fechaActual = new Date();
  const anioActual = fechaActual.getFullYear();
  const mesActual = fechaActual.getMonth(); // Obtener el mes actual (0 para enero, 11 para diciembre)

  const anioEntrada = fechaEntrada.getFullYear();

  // Condición especial para el año actual
  if (anio === anioActual) {
    if (mes === 0) { // Si es enero del año actual
      // Solo se cobra el valor patrimonial correspondiente a la última parte del año anterior
      valorPatrimonial = valorPatrimonialAnterior / 12; // Cobrar la parte restante del patrimonial del año anterior
    } else if (mes === mesActual) { // Si es el mes actual (excepto enero)
      valorPatrimonial = valorPatrimonialPresente; // Cobrar todo el valor patrimonial del año actual
    } else {
      valorPatrimonial = 0; // No se cobra patrimonial en los demás meses del año actual
    }
  } else {
    // Si no es el año actual, aplicar la lógica normal de cobro mensual de patrimonial
    if (mes === 0) { // En enero de años anteriores
      valorPatrimonial = valorPatrimonialAnterior / 12; // Cobro patrimonial del año anterior dividido en 12
    } else if (mes >= 1) { // A partir de febrero se cobra el valor patrimonial del año actual
      valorPatrimonial = valorPatrimonialPresente / 12;
    }
  }

  // Cobro fijo de 182 dólares en noviembre de 2022
  if (mes === 10 && anio === 2022) { // Noviembre es el mes 10
      valorMensual += 182;
  }

  // Cobro adicional en noviembre (predial)
  // Condición especial para el año actual
  if (anio === anioActual) {
    if (mes < 10) { 
      // Solo se cobra el valor patrimonial correspondiente a la última parte del año anterior
      valorPredialMensual = valorPredialAnterior / 12; // Cobrar la parte restante del patrimonial del año anterior
    } else if (mes === mesActual) { // Si es el mes actual (excepto enero)
      valorPredialMensual = valorPredial; // Cobrar todo el valor patrimonial del año actual
    } else {
      valorPredialMensual = 0; // No se cobra patrimonial en los demás meses del año actual
    }
  } else if (anio === anioEntrada) {
    if(mes >= 10){
      valorPredialMensual = valorPredial / 12;
    }
  } else {
    // Si no es el año actual, aplicar la lógica normal de cobro mensual de patrimonial
    if (mes < 10) { // En meses antes de noviembre de años anteriores
      valorPredialMensual = valorPredialAnterior / 12; // Cobro patrimonial del año anterior dividido en 12
    } else if (mes >= 10) { // A partir de febrero se cobra el valor patrimonial del año actual
      valorPredialMensual = valorPredial / 12;
    }
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
    const estatusPermitidos = ["Juv. Perdio Derecho", "Retirado"];
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
      const { fechaInicioCobroInput, tipoCobro } = req.body; // 'tipoCobro' puede ser 'Retirado' o 'Juvenil'

      // Verificar si 'tipoCobro' y 'fechaInicioCobroInput' son proporcionados
      if (!tipoCobro || !fechaInicioCobroInput) {
          return res.status(400).json({ message: 'Tipo de Cobro y Fecha de Inicio de Cobro son obligatorios' });
      }
      
      // Convertir la fecha de formato dd-mm-aaaa a un objeto Date
      let fechaInicioCobro = parse(fechaInicioCobroInput, 'dd-MM-yyyy', new Date(), { locale: es });
      
      if (isNaN(fechaInicioCobro.getTime())) {
          return res.status(400).json({ message: 'Formato de fecha inválido. Utilice dd-mm-aaaa' });
      }

      console.log("Membresía recibida:", Membresia);
      console.log("Fecha de inicio de cobro ingresada:", fechaInicioCobroInput);
      console.log("Fecha de inicio de cobro convertida:", fechaInicioCobro);
      console.log("Tipo de cobro seleccionado:", tipoCobro);

      const socio = await prisma.contactscm_fac_elec_arast.findUnique({
          where: {
              Membresia: Membresia,
              Estatus: {
                  in: ["Juv. Perdio Derecho", "Retirado"]
              }
          }
      });

      if (!socio) {
          return res.status(404).json({ message: 'Socio no encontrado o en estado inválido' });
      }

      let fechaCumple27 = 0;
      let fecha21Sept2021 = 0;
      let fechaCumple22 = 0;

      console.log("Fecha de inicio de cobro inicial:", fechaInicioCobro);

      let categoria = socio.Categoria;

      if (tipoCobro === "Retirado") {
          console.log("Calculando como Retirado...");
      } else {
          console.log("Calculando como Juvenil Perdido Derecho...");
          fechaCumple27 = addYears(new Date(socio.FechaNac), 27);
          fechaCumple27.setMonth(fechaCumple27.getMonth() + 1);
          fechaCumple22 = addYears(new Date(socio.FechaNac), 22);
          fechaCumple22.setMonth(fechaCumple22.getMonth() + 1);
          fecha21Sept2021 = new Date(2021, 8, 21);

          if (categoria === "Juvenil") {
              if (fechaCumple27 >= fecha21Sept2021) {
                  fechaInicioCobro = fechaCumple27;
                  console.log("Fecha de inicio de cobro actualizada a:", fechaInicioCobro);
                  categoria = "Activo >= 27";
              } else if (categoria === "Activo >= 26") {
                  categoria = "Activo >= 27";
              } else {
                  fechaInicioCobro = fechaCumple22;
                  console.log("Fecha de inicio de cobro actualizada a:", fechaInicioCobro);
                  categoria = "Activo < 27";
              }
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
          let totalPatrimonialAnual = 0;
          let totalPredialAnual = 0;

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
                      valorPatrimonialPresente: true,
                      valorPredial: true
                  }
              });

              const { valorCuotaPresente, valorPatrimonialPresente, valorPredial } = cuota;
              const valorPatrimonialAnterior = cuotaAnterior ? cuotaAnterior.valorPatrimonialPresente : 0;
              const valorPredialAnterior = cuotaAnterior ? cuotaAnterior.valorPredial : 0;

              const { valorMensual, valorPatrimonial, valorPredial: valorPredialMensual } = calcularValorMensual(
                  mes,
                  anio,
                  valorCuotaPresente,
                  valorPatrimonialPresente,
                  valorPatrimonialAnterior,
                  valorPredial,
                  valorPredialAnterior,
                  fechaInicioCobro
              );

              totalAnual += valorMensual;
              totalCuota += valorCuotaPresente;
              totalPatrimonial += valorPatrimonial;
              totalPredial += valorPredialMensual;

              totalPatrimonialAnual += valorPatrimonial;
              totalPredialAnual += valorPredialMensual;

              meses.push({ mes: mesNombre, categoria: categoriaMensual, valor: valorMensual });
          }

          totalFinal += totalAnual;

          listaAnios.push({
              anio,
              meses,
              totalAnual,
              totalPatrimonialAnual,
              totalPredialAnual
          });
      }

      // Si el tipo de cobro es "Juvenil", sumar $8000 al total final
      if (tipoCobro === "Juvenil") {
          totalFinal += 8000;
      }

      // Calcular amnistía (mitad del total final)
      const amnistia = totalFinal / 2;

      return res.json({
          anios: listaAnios,
          totalFinal,
          totalCuota,
          totalPatrimonial,
          totalPredial,
          amnistia // Devolver el valor de amnistía
      });

  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error en el servidor' });
  }
};
