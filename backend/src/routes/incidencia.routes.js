import { Router } from 'express'
import {
  listarIncidencias,
  obtenerIncidencia,
  crearIncidencia,
  actualizarIncidencia,
  eliminarIncidencia,
} from '../controllers/incidencia.controller.js'

export const incidenciaRouter = Router()

incidenciaRouter.get('/', listarIncidencias)
incidenciaRouter.get('/:id', obtenerIncidencia)
incidenciaRouter.post('/', crearIncidencia)
incidenciaRouter.put('/:id', actualizarIncidencia)
incidenciaRouter.delete('/:id', eliminarIncidencia)