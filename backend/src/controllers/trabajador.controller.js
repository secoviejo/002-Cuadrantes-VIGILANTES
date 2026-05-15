import * as trabajadorRepository from '../repositories/trabajador.repository.js'
import {
  asyncHandler,
  parseCommonListFilters,
  parseIdParam,
  sendDetailResponse,
  sendListResponse,
} from '../utils/httpUtils.js'

export const listarTrabajadores = asyncHandler(async (req, res) => {
  const filters = parseCommonListFilters(req.query)
  const result = await trabajadorRepository.findAll(filters)
  sendListResponse(res, result, filters)
})

export const obtenerTrabajador = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id)
  const trabajador = await trabajadorRepository.findById(id)
  sendDetailResponse(res, trabajador, 'Trabajador')
})
