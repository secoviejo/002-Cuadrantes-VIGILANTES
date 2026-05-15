import { Router } from 'express'
import { actualizarCampus, crearCampus } from '../controllers/campus.controller.js'

export const campusRouter = Router()

campusRouter.post('/', crearCampus)
campusRouter.put('/:id', actualizarCampus)
