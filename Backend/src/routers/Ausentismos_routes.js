import {Router} from 'express'
import { ConsultaAusentismo, consultaPagoAusentismoCuota, consultarPagoPatrimonial, RegistroMigratorio, verRegistrosMigratoriosPorMembresia } from '../controllers/Ausentismos.js'
import { verificarToken } from '../middlewares/authMiddleware.js'

const router = Router()

router.get('/ausentismo/:Membresia',verificarToken,ConsultaAusentismo)
router.post('/ausentismo/registroMigratorio',verificarToken,RegistroMigratorio)
router.get('/ausentismo/consultarRegistroMigratorio/:membresia',verificarToken,verRegistrosMigratoriosPorMembresia)
router.get('/ausentismo/consultarCuotaPagos/:membresia',verificarToken,consultaPagoAusentismoCuota)
router.get('/ausentismo/consultarPatrimonial/:membresia',verificarToken,consultarPagoPatrimonial)

export default router

