import * as sustitucionRepository from '../repositories/sustitucion.repository.js'
import {
  asyncHandler,
  parseBodyInteger,
  parseCommonListFilters,
  parseIdParam,
  pickDefinedFields,
  sendCreatedResponse,
  sendDetailResponse,
  sendListResponse,
} from '../utils/httpUtils.js'

const CAMPOS_SUSTITUCION = ['turnoId', 'trabajadorOriginalId', 'trabajadorSustitutoId', 'motivo', 'comunicadaEn', 'cumplePreaviso']

export const listarSustituciones = asyncHandler(async (req, res) => {
  const filters = parseCommonListFilters(req.query)
  const result = await sustitucionRepository.findAll(filters)
  sendListResponse(res, result, filters)
})

export const obtenerSustitucion = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id)
  const sustitucion = await sustitucionRepository.findById(id)
  sendDetailResponse(res, sustitucion, 'Sustitucion')
})

export const crearSustitucion = asyncHandler(async (req, res) => {
  const data = pickDefinedFields(req.body, CAMPOS_SUSTITUCION)

  if (data.turnoId !== undefined) {
    data.turnoId = parseBodyInteger(data.turnoId, 'turnoId')
  }
  if (data.trabajadorOriginalId !== undefined) {
    data.trabajadorOriginalId = parseBodyInteger(data.trabajadorOriginalId, 'trabajadorOriginalId')
  }
  if (data.trabajadorSustitutoId !== undefined) {
    data.trabajadorSustitutoId = parseBodyInteger(data.trabajadorSustitutoId, 'trabajadorSustitutoId')
  }

  if (!data.turnoId || !data.trabajadorOriginalId || !data.motivo) {
    return res.status(400).json({ error: 'Faltan campos requeridos: turnoId, trabajadorOriginalId, motivo' })
  }

  const sustitucion = await sustitucionRepository.create(data)
  sendCreatedResponse(res, sustitucion)
})

export const actualizarSustitucion = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id)
  const data = pickDefinedFields(req.body, CAMPOS_SUSTITUCION)

  if (data.trabajadorSustitutoId !== undefined) {
    data.trabajadorSustitutoId = data.trabajadorSustitutoId ? parseBodyInteger(data.trabajadorSustitutoId, 'trabajadorSustitutoId') : null
  }
  if (data.comunicadaEn !== undefined) {
    data.comunicadaEn = data.comunicadaEn ? new Date(data.comunicadaEn) : null
  }

  const sustitucion = await sustitucionRepository.update(id, data)
  sendDetailResponse(res, sustitucion, 'Sustitucion')
})

export const eliminarSustitucion = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id)
  await sustitucionRepository.remove(id)
  res.status(204).send()
})