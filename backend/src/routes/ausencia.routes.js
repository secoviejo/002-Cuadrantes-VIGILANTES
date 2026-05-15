import { Router } from 'express'
import { listarAusencias, obtenerAusencia } from '../controllers/ausencia.controller.js'

export const ausenciaRouter = Router()

ausenciaRouter.get('/', listarAusencias)
ausenciaRouter.get('/:id', obtenerAusencia)
