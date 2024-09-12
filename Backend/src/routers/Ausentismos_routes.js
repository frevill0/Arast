import {Router} from 'express'
import { ConsultaAusentismo, consultaPagoAusentismoCuota, RegistroMigratorio, verRegistrosMigratoriosPorMembresia } from '../controllers/Ausentismos.js'


const router = Router()

router.get('/ausentismo/:Membresia',ConsultaAusentismo)
router.post('/ausentismo/registroMigratorio', RegistroMigratorio)
router.get('/ausentismo/consultarRegistroMigratorio/:membresia', verRegistrosMigratoriosPorMembresia)
router.get('/ausentismo/consultarCuotaPagos/:membresia', consultaPagoAusentismoCuota)

export default router

