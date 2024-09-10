import {Router} from 'express'
import { ConsultaAusentismo, RegistroMigratorio } from '../controllers/Ausentismos.js'


const router = Router()

router.get('/ausentismo/:Membresia',ConsultaAusentismo)
router.post('/ausentismo/registroMigratorio', RegistroMigratorio)

export default router

