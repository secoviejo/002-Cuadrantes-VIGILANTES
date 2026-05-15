import { Router } from 'express'
import { listarTurnos, obtenerTurno } from '../controllers/turno.controller.js'

export const turnoRouter = Router()

turnoRouter.get('/', listarTurnos)
turnoRouter.get('/:id', obtenerTurno)
