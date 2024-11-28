import { Router } from 'express'
import { reporteSocios27, reporteSocios65 } from '../controllers/Reportes.js'
import { verificarToken } from '../middlewares/authMiddleware.js'

const router = Router()

router.post('/reporte/socios27', verificarToken, reporteSocios27)
router.post('/reporte/socios65', verificarToken, reporteSocios65)

export default router
