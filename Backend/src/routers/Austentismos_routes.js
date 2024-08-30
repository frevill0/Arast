import {Router} from 'express'
import { ConsultaAusentismo } from '../controllers/Ausentismos.js'


const router = Router()

router.get('/ausentismo/:Membresia',ConsultaAusentismo)

export default router

