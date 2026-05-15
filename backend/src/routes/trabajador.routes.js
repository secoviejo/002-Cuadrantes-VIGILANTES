import { Router } from 'express'
import { listarTrabajadores, obtenerTrabajador } from '../controllers/trabajador.controller.js'

export const trabajadorRouter = Router()

trabajadorRouter.get('/', listarTrabajadores)
trabajadorRouter.get('/:id', obtenerTrabajador)
