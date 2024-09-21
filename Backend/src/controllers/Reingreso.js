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
        EstadoActual: estadoAnterior.Estatus_actual,
        EstadoAnterior: estadoAnterior.estadoAnterior,
        FechaFinalLiquidacion: formatoFecha(fechaActual),  
        EstadoProceso: "Abierto", // No hay fecha de final de suspensión
      };
  
      res.status(200).json({ res: 'Detalles del socio y reingreso:', data: resultado });
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "Error interno del servidor" });
    }
  };


  export const consultaPagoReingreso = async (req, res) => {
    const { Membresia, amnistia } = req.params;  
    console.log("Membresía recibida:", Membresia);
    console.log("Estado de amnistía:", amnistia);
  
    if (!Membresia) {
      return res.status(400).send({ msg: "Esa no es una membresía válida" });
    }
  
    try {
      // Encontrar al socio
      const encontrarSocio = await prisma.contactscm_fac_elec_arast.findUnique({
        where: { Membresia },
        select: { fechaRetSep: true, Estatus: true, Categoria: true },
      });
  
      if (!encontrarSocio) {
        return res.status(400).send({ msg: "No se encontró un socio con esa membresía" });
      }
  
      let { Categoria } = encontrarSocio;
  
      if (Categoria === "Activo >= 26") {
        Categoria = "Activo >= 27";
      }
  
      // Verificar el estado anterior
      const estadoAnterior = await prisma.vw_estado_anterior_susp_temporal.findFirst({
        where: { membresia: Membresia },
        select: { Estatus_actual: true },
      });
  
      if (!estadoAnterior) {
        return res.status(400).send({ msg: "No se encontró el estado anterior para esa membresía" });
      }
  
      const estadoPrevio = estadoAnterior.Estatus;
  
      // Obtener la fecha de retiro y la fecha actual
      const fechaRetiro = new Date(encontrarSocio.fechaRetSep);
      const fechaActual = new Date();
      const anioActual = fechaActual.getFullYear();
  
      // Almacenar los pagos por año
      const pagosPorAnio = {};
  
      // Consultar la cuota del año actual para la categoría
      const cuotaActual = await prisma.cuota.findFirst({
        where: {
          categoria: Categoria,
          anio: anioActual,
        },
      });
  
      console.log("Consultando cuota para categoría:", Categoria, "y año:", anioActual);
      console.log(cuotaActual);
  
      // Calcular los montos para cada año desde la fecha de retiro hasta el año actual
      for (let anio = fechaRetiro.getFullYear(); anio <= anioActual; anio++) {
        // Inicializar el objeto del año si no existe
        if (!pagosPorAnio[anio]) {
          pagosPorAnio[anio] = {
            TotalAnio: 0,
            Detalles: [],
          };
        }
  
        let montoAnio = 0;
  
        // Calcular el monto a pagar para cada mes
        for (let mesNum = 0; mesNum < 12; mesNum++) {
          let montoMes = 0; // Inicializa en 0
  
          if (mesNum === 1) { // Febrero
            if (cuotaActual && cuotaActual.valorPatrimonialPresente !== null) {
              montoMes += cuotaActual.valorPatrimonialPresente * (amnistia === 'true' ? 0.5 : 1);
            }
          }
          if (mesNum === 10) { // Noviembre
            if (cuotaActual && cuotaActual.valorPredial !== null) {
              montoMes += cuotaActual.valorPredial * (amnistia === 'true' ? 0.5 : 1);
            }
          }
  
          // Siempre incluir la cuota presente
          if (cuotaActual && cuotaActual.valorCuotaPresente !== null) {
            montoMes += cuotaActual.valorCuotaPresente * (amnistia === 'true' ? 0.5 : 1);
          }
  
          // Actualizar total del año
          pagosPorAnio[anio].TotalAnio += montoMes;
  
          // Agregar detalle del mes al año solo si hay un monto
          if (montoMes > 0) {
            pagosPorAnio[anio].Detalles.push({
              Mes: new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date(0, mesNum)),
              Monto: montoMes,
            });
          }
        }
      }
  
      // Si el estado anterior era "Juv. Perdio Derecho", agregar 8000 solo una vez
      if (estadoPrevio === "Juv. Perdio Derecho") {
        if (!pagosPorAnio[fechaRetiro.getFullYear()]) {
          pagosPorAnio[fechaRetiro.getFullYear()] = {
            TotalAnio: 0,
            Detalles: [],
          };
        }
        pagosPorAnio[fechaRetiro.getFullYear()].TotalAnio += 8000; // Se suma el pago extra
        pagosPorAnio[fechaRetiro.getFullYear()].Detalles.push({
          Mes: 'Pago Extra',
          Monto: 8000,
        });
      }
  
      res.status(200).json({ res: 'Detalles de pagos por reingreso:', Pagos: pagosPorAnio });
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "Error interno del servidor" });
    }
  };
  
  
  