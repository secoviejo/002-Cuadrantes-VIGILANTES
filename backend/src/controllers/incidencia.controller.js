import * as incidenciaRepository from '../repositories/incidencia.repository.js'
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

const CAMPOS_INCIDENCIA = ['turnoId', 'trabajadorId', 'titulo', 'descripcion', 'estado', 'cerradaEn']

export const listarIncidencias = asyncHandler(async (req, res) => {
  const filters = parseCommonListFilters(req.query)
  const result = await incidenciaRepository.findAll(filters)
  sendListResponse(res, result, filters)
})

export const obtenerIncidencia = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id)
  const incidencia = await incidenciaRepository.findById(id)
  sendDetailResponse(res, incidencia, 'Incidencia')
})

export const crearIncidencia = asyncHandler(async (req, res) => {
  const data = pickDefinedFields(req.body, CAMPOS_INCIDENCIA)

  if (data.turnoId !== undefined) {
    data.turnoId = data.turnoId ? parseBodyInteger(data.turnoId, 'turnoId') : null
  }
  if (data.trabajadorId !== undefined) {
    data.trabajadorId = data.trabajadorId ? parseBodyInteger(data.trabajadorId, 'trabajadorId') : null
  }

  if (!data.titulo) {
    return res.status(400).json({ error: 'El campo titulo es requerido' })
  }

  const incidencia = await incidenciaRepository.create(data)
  sendCreatedResponse(res, incidencia)
})

export const actualizarIncidencia = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id)
  const data = pickDefinedFields(req.body, CAMPOS_INCIDENCIA)

  if (data.turnoId !== undefined) {
    data.turnoId = data.turnoId ? parseBodyInteger(data.turnoId, 'turnoId') : null
  }
  if (data.trabajadorId !== undefined) {
    data.trabajadorId = data.trabajadorId ? parseBodyInteger(data.trabajadorId, 'trabajadorId') : null
  }
  if (data.cerradaEn !== undefined) {
    data.cerradaEn = data.cerradaEn ? new Date(data.cerradaEn) : null
  }

  const incidencia = await incidenciaRepository.update(id, data)
  sendDetailResponse(res, incidencia, 'Incidencia')
})

export const eliminarIncidencia = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id)
  await incidenciaRepository.remove(id)
  res.status(204).send()
})