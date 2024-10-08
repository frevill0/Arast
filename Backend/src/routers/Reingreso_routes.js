import {Router} from 'express'
import { consultaPagoReingreso, ConsultaReingreso } from '../controllers/Reingreso.js'
import { verificarToken } from '../middlewares/authMiddleware.js'

const router = Router()

router.get('/reingreso/:Membresia',verificarToken,ConsultaReingreso)
router.post('/reingreso/pago/:Membresia',verificarToken, consultaPagoReingreso)

export default router