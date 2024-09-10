import {Router} from 'express'
import { actualizarCuota, crearCuotas, eliminarCuotasPorAnio, obtenerCuotasPorAnio } from '../controllers/Cuotas.js';

const router = Router();

router.post('/cuotas/crear',crearCuotas)
router.get('/cuotas/:anio',obtenerCuotasPorAnio)
router.put('/cuotas/:anio/:categoria', actualizarCuota);
router.delete('/cuotas/:anio', eliminarCuotasPorAnio)
export default router
