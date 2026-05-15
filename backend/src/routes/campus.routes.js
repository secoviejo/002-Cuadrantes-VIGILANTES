import { Router } from 'express'
import { actualizarCampus, crearCampus, listarCampus, obtenerCampus } from '../controllers/campus.controller.js'

export const campusRouter = Router()

campusRouter.get('/', listarCampus)
campusRouter.get('/:id', obtenerCampus)
campusRouter.post('/', crearCampus)
campusRouter.put('/:id', actualizarCampus)
