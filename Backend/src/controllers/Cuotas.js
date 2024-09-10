import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const categoriasPermitidas = [
  "Activo >= 27",
  "Activo < 27",
  "Especial x Propios D",
  "Especial Viudo",
  "Vitalicio",
  "Corresponsal"
];

export const crearCuotas = async (req, res) => {
  try {
    const cuotas = req.body; 

    if (!Array.isArray(cuotas)) {
      return res.status(400).json({ error: 'Se requiere un array de cuotas' });
    }

    for (const cuota of cuotas) {
      if (!categoriasPermitidas.includes(cuota.categoria)) {
        return res.status(400).json({
          error: `La categoría '${cuota.categoria}' no es válida. Categorías permitidas: ${categoriasPermitidas.join(', ')}`,
        });
      }
    }

    const nuevasCuotas = await prisma.cuota.createMany({
      data: cuotas
    });

    res.status(201).json({
      message: `${nuevasCuotas.count} cuotas creadas exitosamente.`,
    });
  } catch (error) {
    console.error('Error al crear cuotas:', error);
    res.status(500).json({ error: 'No se pudieron crear las cuotas' });
  }
};

export const obtenerCuotasPorAnio = async (req, res) => {
    try {
      const { anio } = req.params; 
  
      if (!anio || isNaN(anio)) {
        return res.status(400).json({ error: 'Debe proporcionar un año válido.' });
      }
  
      const cuotas = await prisma.cuota.findMany({
        where: {
          anio: parseInt(anio), 
        },
      });
  
      if (cuotas.length === 0) {
        return res.status(404).json({ message: `No se encontraron cuotas para el año ${anio}.` });
      }
  
      res.status(200).json(cuotas);
    } catch (error) {
      console.error('Error al obtener cuotas:', error);
      res.status(500).json({ error: 'Error al consultar las cuotas.' });
    }
  };

export const actualizarCuota = async (req, res) => {
  try {
    const { anio, categoria } = req.params; 
    const {
      valorCuotaPresente,
      valorCuotaAusente,
      valorPatrimonialPresente,
      valorPatrimonialAusente,
      valorPredial
    } = req.body; 

    if (!anio || isNaN(anio) || !categoria) {
      return res.status(400).json({ error: 'Debe proporcionar un año válido y una categoría.' });
    }

    const cuotaExistente = await prisma.cuota.findFirst({
      where: {
        anio: parseInt(anio),
        categoria: categoria
      }
    });

    if (!cuotaExistente) {
      return res.status(404).json({
        message: `No se encontró ninguna cuota para el año ${anio} y la categoría ${categoria}.`
      });
    }

    const cuotaActualizada = await prisma.cuota.updateMany({
      where: {
        anio: parseInt(anio),
        categoria: categoria
      },
      data: {
        valorCuotaPresente,
        valorCuotaAusente,
        valorPatrimonialPresente,
        valorPatrimonialAusente,
        valorPredial
      }
    });

    res.status(200).json({
      message: 'Cuota actualizada exitosamente',
      cuotaActualizada
    });
  } catch (error) {
    console.error('Error al actualizar cuota:', error);
    res.status(500).json({ error: 'Error al actualizar la cuota.' });
  }
};

export const eliminarCuotasPorAnio = async (req, res) => {
  try {
    const { anio } = req.params;

    if (!anio || isNaN(anio)) {
      return res.status(400).json({ error: 'Debe proporcionar un año válido.' });
    }

    const resultado = await prisma.cuota.deleteMany({
      where: {
        anio: parseInt(anio),
      },
    });

    if (resultado.count === 0) {
      return res.status(404).json({ message: `No se encontraron cuotas para el año ${anio}.` });
    }

    res.status(200).json({
      message: `${resultado.count} cuotas eliminadas exitosamente.`,
    });
  } catch (error) {
    console.error('Error al eliminar cuotas:', error);
    res.status(500).json({ error: 'Error al eliminar las cuotas.' });
  }
};

