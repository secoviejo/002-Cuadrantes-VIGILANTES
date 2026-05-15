import { Router } from 'express'
import {
  listarVerificaciones,
  obtenerVerificacion,
  crearVerificacion,
  actualizarVerificacion,
  eliminarVerificacion,
} from '../controllers/verificacion.controller.js'

export const verificacionRouter = Router()

verificacionRouter.get('/', listarVerificaciones)
verificacionRouter.get('/:id', obtenerVerificacion)
verificacionRouter.post('/', crearVerificacion)
verificacionRouter.put('/:id', actualizarVerificacion)
verificacionRouter.delete('/:id', eliminarVerificacion)