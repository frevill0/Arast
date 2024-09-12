import {Router} from 'express'
import { ConsultaAusentismo, RegistroMigratorio, verRegistrosMigratoriosPorMembresia } from '../controllers/Ausentismos.js'


const router = Router()

router.get('/ausentismo/:Membresia',ConsultaAusentismo)
router.post('/ausentismo/registroMigratorio', RegistroMigratorio)
router.get('/ausentismo/consultarRegistroMigratorio/:membresia', verRegistrosMigratoriosPorMembresia)

export default router

