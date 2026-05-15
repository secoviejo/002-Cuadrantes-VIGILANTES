import { Router } from 'express'
import { actualizarEdificio, crearEdificio, listarEdificios, obtenerEdificio } from '../controllers/edificio.controller.js'

export const edificioRouter = Router()

edificioRouter.get('/', listarEdificios)
edificioRouter.get('/:id', obtenerEdificio)
edificioRouter.post('/', crearEdificio)
edificioRouter.put('/:id', actualizarEdificio)
