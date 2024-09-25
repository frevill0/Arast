import {Router} from 'express'
import { actualizarCuota, crearCuotas, eliminarCuotasPorAnio, obtenerCuotasPorAnio } from '../controllers/Cuotas.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/cuotas/crear',verificarToken,crearCuotas)
router.get('/cuotas/:anio',verificarToken,obtenerCuotasPorAnio)
router.put('/cuotas/:anio/:categoria',verificarToken,actualizarCuota)
router.delete('/cuotas/:anio',verificarToken,eliminarCuotasPorAnio)
export default router
