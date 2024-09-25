import {Router} from 'express'
import { consultaPagoSuspension, ConsultaSuspension } from '../controllers/Suspensiones.js'
import { verificarToken } from '../middlewares/authMiddleware.js'


const router = Router()

router.get('/suspension/:Membresia',verificarToken,ConsultaSuspension)
router.get('/suspension/pago/:Membresia',verificarToken,consultaPagoSuspension)

export default router