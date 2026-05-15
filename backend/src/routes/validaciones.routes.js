import { Router } from 'express'
import {
  validarAsignacion,
  validarAsignacionesMasivas,
} from '../controllers/validaciones.controller.js'

export const validacionesRouter = Router()

validacionesRouter.get('/validar-asignacion', validarAsignacion)
validacionesRouter.post('/validar-asignaciones-masivas', validarAsignacionesMasivas)