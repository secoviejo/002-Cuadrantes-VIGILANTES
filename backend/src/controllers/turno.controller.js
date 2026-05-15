import * as turnoRepository from '../repositories/turno.repository.js'
import {
  asyncHandler,
  parseCommonListFilters,
  parseIdParam,
  sendDetailResponse,
  sendListResponse,
} from '../utils/httpUtils.js'

export const listarTurnos = asyncHandler(async (req, res) => {
  const filters = parseCommonListFilters(req.query)
  const result = await turnoRepository.findAll(filters)
  sendListResponse(res, result, filters)
})

export const obtenerTurno = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id)
  const turno = await turnoRepository.findById(id)
  sendDetailResponse(res, turno, 'Turno')
})
