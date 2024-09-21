import {Router} from 'express'
import { consultaPagoReingreso, ConsultaReingreso } from '../controllers/Reingreso.js'

const router = Router()

router.get('/reingreso/:Membresia',ConsultaReingreso)
router.get('/reingreso/pago/:Membresia/:amnistia', consultaPagoReingreso)

export default router