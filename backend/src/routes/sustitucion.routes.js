import { Router } from 'express'
import {
  listarSustituciones,
  obtenerSustitucion,
  crearSustitucion,
  actualizarSustitucion,
  eliminarSustitucion,
} from '../controllers/sustitucion.controller.js'

export const sustitucionRouter = Router()

sustitucionRouter.get('/', listarSustituciones)
sustitucionRouter.get('/:id', obtenerSustitucion)
sustitucionRouter.post('/', crearSustitucion)
sustitucionRouter.put('/:id', actualizarSustitucion)
sustitucionRouter.delete('/:id', eliminarSustitucion)