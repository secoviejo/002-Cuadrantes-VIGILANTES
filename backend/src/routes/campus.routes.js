import { Router } from 'express'
import { actualizarCampus, crearCampus, listarCampus, obtenerCampus } from '../controllers/campus.controller.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

export const campusRouter = Router()

campusRouter.use(authenticateToken)
campusRouter.use(requireRole('ADMIN', 'UNIDAD_SEGURIDAD_UZ'))

campusRouter.get('/', listarCampus)
campusRouter.get('/:id', obtenerCampus)
campusRouter.post('/', crearCampus)
campusRouter.put('/:id', actualizarCampus)
