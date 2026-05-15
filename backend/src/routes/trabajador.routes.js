import { Router } from 'express'
import {
  actualizarTrabajador,
  crearTrabajador,
  listarTrabajadores,
  obtenerTrabajador,
} from '../controllers/trabajador.controller.js'

export const trabajadorRouter = Router()

trabajadorRouter.get('/', listarTrabajadores)
trabajadorRouter.post('/', crearTrabajador)
trabajadorRouter.get('/:id', obtenerTrabajador)
trabajadorRouter.put('/:id', actualizarTrabajador)
