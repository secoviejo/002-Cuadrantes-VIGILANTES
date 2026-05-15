import { Router } from 'express'
import { actualizarTurno, crearTurno, listarTurnos, obtenerTurno } from '../controllers/turno.controller.js'

export const turnoRouter = Router()

turnoRouter.get('/', listarTurnos)
turnoRouter.get('/:id', obtenerTurno)
turnoRouter.post('/', crearTurno)
turnoRouter.put('/:id', actualizarTurno)
