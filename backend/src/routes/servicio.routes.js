import { Router } from 'express'
import { listarServicios, obtenerServicio } from '../controllers/servicio.controller.js'

export const servicioRouter = Router()

servicioRouter.get('/', listarServicios)
servicioRouter.get('/:id', obtenerServicio)
