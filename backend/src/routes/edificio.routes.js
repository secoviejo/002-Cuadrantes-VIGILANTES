import { Router } from 'express'
import { actualizarEdificio, crearEdificio } from '../controllers/edificio.controller.js'

export const edificioRouter = Router()

edificioRouter.post('/', crearEdificio)
edificioRouter.put('/:id', actualizarEdificio)
