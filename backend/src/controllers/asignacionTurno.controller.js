import * as asignacionTurnoRepository from '../repositories/asignacionTurno.repository.js'
import {
  asyncHandler,
  parseCommonListFilters,
  parseIdParam,
  sendDetailResponse,
  sendListResponse,
} from '../utils/httpUtils.js'

export const listarAsignacionesTurno = asyncHandler(async (req, res) => {
  const filters = parseCommonListFilters(req.query)
  const result = await asignacionTurnoRepository.findAll(filters)
  sendListResponse(res, result, filters)
})

export const obtenerAsignacionTurno = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id)
  const asignacion = await asignacionTurnoRepository.findById(id)
  sendDetailResponse(res, asignacion, 'Asignacion de turno')
})
