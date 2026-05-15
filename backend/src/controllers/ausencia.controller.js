import * as ausenciaRepository from '../repositories/ausencia.repository.js'
import {
  asyncHandler,
  parseCommonListFilters,
  parseIdParam,
  sendDetailResponse,
  sendListResponse,
} from '../utils/httpUtils.js'

export const listarAusencias = asyncHandler(async (req, res) => {
  const filters = parseCommonListFilters(req.query)
  const result = await ausenciaRepository.findAll(filters)
  sendListResponse(res, result, filters)
})

export const obtenerAusencia = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id)
  const ausencia = await ausenciaRepository.findById(id)
  sendDetailResponse(res, ausencia, 'Ausencia')
})
