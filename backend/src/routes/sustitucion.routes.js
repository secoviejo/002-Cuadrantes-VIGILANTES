import { Router } from 'express'
import {
  listarSustituciones,
  obtenerSustitucion,
  crearSustitucion,
  actualizarSustitucion,
  eliminarSustitucion,
} from '../controllers/sustitucion.controller.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

export const sustitucionRouter = Router()

sustitucionRouter.use(authenticateToken)
sustitucionRouter.use(requireRole('ADMIN', 'UNIDAD_SEGURIDAD_UZ', 'CONTRATA'))

sustitucionRouter.get('/', listarSustituciones)
sustitucionRouter.get('/:id', obtenerSustitucion)
sustitucionRouter.post('/', crearSustitucion)
sustitucionRouter.put('/:id', actualizarSustitucion)
sustitucionRouter.delete('/:id', eliminarSustitucion)
