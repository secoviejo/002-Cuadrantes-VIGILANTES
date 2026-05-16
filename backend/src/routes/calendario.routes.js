import { Router } from 'express'
import { altaFestivo, calendarioLaboral } from '../controllers/calendario.controller.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

export const calendarioRouter = Router()

calendarioRouter.use(authenticateToken)
calendarioRouter.use(requireRole('ADMIN', 'UNIDAD_SEGURIDAD_UZ'))

calendarioRouter.get('/', calendarioLaboral)
calendarioRouter.post('/', altaFestivo)
