import {Router} from 'express'
import { consultaPagoReingreso, ConsultaReingreso } from '../controllers/Reingreso.js'
import { verificarToken } from '../middlewares/authMiddleware.js'

const router = Router()

router.get('/reingreso/:Membresia',verificarToken,ConsultaReingreso)
router.get('/reingreso/pago/:Membresia/:amnistia',verificarToken, consultaPagoReingreso)

export default router