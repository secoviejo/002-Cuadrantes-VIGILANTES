import { Router } from 'express'
import {
  actualizarServicio,
  crearServicio,
  listarServicios,
  obtenerServicio,
} from '../controllers/servicio.controller.js'

export const servicioRouter = Router()

servicioRouter.get('/', listarServicios)
servicioRouter.post('/', crearServicio)
servicioRouter.get('/:id', obtenerServicio)
servicioRouter.put('/:id', actualizarServicio)
