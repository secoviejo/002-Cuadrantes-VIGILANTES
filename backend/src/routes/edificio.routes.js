import { Router } from 'express'
import { actualizarEdificio, crearEdificio, listarEdificios, obtenerEdificio } from '../controllers/edificio.controller.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

export const edificioRouter = Router()

edificioRouter.use(authenticateToken)
edificioRouter.use(requireRole('ADMIN', 'UNIDAD_SEGURIDAD_UZ'))

edificioRouter.get('/', listarEdificios)
edificioRouter.get('/:id', obtenerEdificio)
edificioRouter.post('/', crearEdificio)
edificioRouter.put('/:id', actualizarEdificio)
