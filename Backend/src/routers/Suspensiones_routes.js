import {Router} from 'express'
import { consultaPagoSuspension, ConsultaSuspension } from '../controllers/Suspensiones.js'


const router = Router()

router.get('/suspension/:Membresia',ConsultaSuspension)
router.get('/suspension/pago/:Membresia',consultaPagoSuspension)

export default router