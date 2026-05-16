import { Router } from 'express'
import { actualizarTurno, crearTurno, listarTurnos, obtenerTurno } from '../controllers/turno.controller.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

export const turnoRouter = Router()

turnoRouter.use(authenticateToken)
turnoRouter.get('/', requireRole('ADMIN', 'UNIDAD_SEGURIDAD_UZ', 'CONTRATA'), listarTurnos)
turnoRouter.get('/:id', requireRole('ADMIN', 'UNIDAD_SEGURIDAD_UZ', 'CONTRATA'), obtenerTurno)
turnoRouter.post('/', requireRole('ADMIN', 'UNIDAD_SEGURIDAD_UZ'), crearTurno)
turnoRouter.put('/:id', requireRole('ADMIN', 'UNIDAD_SEGURIDAD_UZ'), actualizarTurno)
