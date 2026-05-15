import * as servicioRepository from '../repositories/servicio.repository.js'
import {
  asyncHandler,
  parseCommonListFilters,
  parseIdParam,
  sendDetailResponse,
  sendListResponse,
} from '../utils/httpUtils.js'

export const listarServicios = asyncHandler(async (req, res) => {
  const filters = parseCommonListFilters(req.query)
  const result = await servicioRepository.findAll(filters)
  sendListResponse(res, result, filters)
})

export const obtenerServicio = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id)
  const servicio = await servicioRepository.findById(id)
  sendDetailResponse(res, servicio, 'Servicio')
})
