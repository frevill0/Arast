import { PrismaClient } from '@prisma/client';
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';

const prisma = new PrismaClient();

const formatoFecha = (fecha) => {
    if (!fecha) return null;
    return format(new Date(fecha), 'dd/MM/yyyy', { locale: es });
};

export const reporteSocios27 = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.body;

        if (!fechaInicio || !fechaFin) {
            return res.status(400).json({ 
                msg: "Las fechas de inicio y fin son requeridas" 
            });
        }

        // Convertir las fechas de string a objetos Date
        const fechaInicioObj = parse(fechaInicio, 'yyyy-MM-dd', new Date());
        const fechaFinObj = parse(fechaFin, 'yyyy-MM-dd', new Date());

        // Calcular las fechas de nacimiento correspondientes (27 años antes)
        const fechaNacimientoInicio = new Date(fechaInicioObj.getFullYear() - 27, fechaInicioObj.getMonth(), fechaInicioObj.getDate());
        const fechaNacimientoFin = new Date(fechaFinObj.getFullYear() - 27, fechaFinObj.getMonth(), fechaFinObj.getDate());

        // Consultar los socios que cumplen 27 años entre las fechas calculadas
        const socios = await prisma.contactscm_fac_elec_arast.findMany({
            where: {
                FechaNac: {
                    gte: fechaNacimientoInicio,
                    lte: fechaNacimientoFin
                },
            },
            select: {
                Membresia: true,
                Socio: true,
                FechaNac: true,
                Categoria: true,
                Estatus: true,
                Edad: true,
                Titular: true
            }
        });

        // Formatear las fechas de nacimiento en formato legible
        const sociosFormateados = socios.map(socio => ({
            ...socio,
            FechaNac: formatoFecha(socio.FechaNac),
            FechaCumple27: formatoFecha(new Date(new Date(socio.FechaNac).setFullYear(new Date(socio.FechaNac).getFullYear() + 27)))
        }));

        return res.status(200).json({
            msg: "Reporte generado exitosamente",
            data: sociosFormateados,
            total: sociosFormateados.length
        });

    } catch (error) {
        console.error('Error al consultar el reporte de socios:', error);
        return res.status(500).json({ 
            msg: "Error al consultar el reporte de socios",
            error: error.message 
        });
    }
};

export const reporteSocios65 = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.body;

        if (!fechaInicio || !fechaFin) {
            return res.status(400).json({ 
                msg: "Las fechas de inicio y fin son requeridas" 
            });
        }

        // Convertir las fechas de string a objetos Date
        const fechaInicioObj = parse(fechaInicio, 'yyyy-MM-dd', new Date());
        const fechaFinObj = parse(fechaFin, 'yyyy-MM-dd', new Date());

        if (fechaInicioObj > fechaFinObj) {
            return res.status(400).json({ 
                msg: "La fecha de inicio debe ser anterior a la fecha fin" 
            });
        }

        // Calcular las fechas de nacimiento correspondientes (65 años antes)
        // Invertimos el orden aquí para que coincida con las fechas de cumpleaños
        const fechaNacimientoFin = new Date(fechaInicioObj.getFullYear() - 65, fechaInicioObj.getMonth(), fechaInicioObj.getDate());
        const fechaNacimientoInicio = new Date(fechaFinObj.getFullYear() - 65, fechaFinObj.getMonth(), fechaFinObj.getDate());

        // Consultar los socios que cumplen 65 años entre las fechas calculadas
        const socios = await prisma.contactscm_fac_elec_arast.findMany({
            where: {
                FechaNac: {
                    gte: fechaNacimientoFin,    // Fecha de nacimiento más reciente
                    lte: fechaNacimientoInicio  // Fecha de nacimiento más antigua
                },
            },
            select: {
                Membresia: true,
                Socio: true,
                FechaNac: true,
                Categoria: true,
                Estatus: true,
                Edad: true,
                Titular: true
            }
        });

        // Formatear las fechas de nacimiento en formato legible
        const sociosFormateados = socios.map(socio => ({
            ...socio,
            FechaNac: formatoFecha(socio.FechaNac),
            FechaCumple65: formatoFecha(new Date(new Date(socio.FechaNac).setFullYear(new Date(socio.FechaNac).getFullYear() + 65)))
        }));

        return res.status(200).json({
            msg: "Reporte generado exitosamente",
            data: sociosFormateados,
            total: sociosFormateados.length
        });

    } catch (error) {
        console.error('Error al consultar el reporte de socios:', error);
        return res.status(500).json({ 
            msg: "Error al consultar el reporte de socios",
            error: error.message 
        });
    }
};
